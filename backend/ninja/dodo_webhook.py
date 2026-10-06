import os
import json
import logging
import hmac
import hashlib
import time
import rds_service
from fastapi import Request, HTTPException
from typing import Dict, Any

logger = logging.getLogger(__name__)

async def handle_dodo_webhook(request: Request) -> Dict[str, Any]:
    """
    Handle incoming webhooks from Dodo Payments.
    Updates user subscription status and plan tiers.
    """
    webhook_secret = os.getenv("DODO_WEBHOOK_SECRET")
    payload_raw = await request.body()
    
    # 1. Verify HMAC if secret exists
    signature = request.headers.get("x-dodo-signature")
    signature_valid = False
    
    if webhook_secret and signature:
        expected_sig = hmac.new(
            webhook_secret.encode(), 
            payload_raw, 
            hashlib.sha256
        ).hexdigest()
        signature_valid = hmac.compare_digest(signature, expected_sig)
        
        if not signature_valid:
            logger.warning("Dodo webhook: Invalid signature")

    try:
        data = json.loads(payload_raw)
        event_type = data.get("type")
        webhook_id = request.headers.get("x-dodo-webhook-id", f"dodo_{int(time.time())}") # Fallback
        
        # Log event for auditing
        rds_service.log_payment_event(
            webhook_id=webhook_id,
            event_type=event_type,
            payload=data,
            signature_valid=signature_valid
        )

        # Dodo typical event types: order.success, subscription.created, subscription.updated
        if event_type not in ["order.success", "subscription.created", "subscription.updated"]:
            return {"status": "ignored", "type": event_type}

        # Extract user identification
        customer = data.get("data", {}).get("customer", {})
        email = customer.get("email", "").lower().strip()
        if not email:
            return {"status": "error", "message": "Missing email"}
        
        # Plan info
        product_id = data.get("data", {}).get("product_id")
        
        # 2. Map product to internal tier (based on new pricing)
        tier_map = {
            "prod_starter": "starter",
            "prod_pro": "pro",
            "prod_unlimited": "unlimited"
        }
        plan_tier = tier_map.get(product_id, "starter")

        # 3. Update RDS
        user = rds_service.get_or_create_user(email=email)
        rds_service.update_user_subscription(
            user_id=user["id"],
            plan_tier=plan_tier,
            status="active",
            external_id=data.get("data", {}).get("id") # order/sub id
        )

        return {"status": "success", "event": event_type}

    except Exception as e:
        logger.error(f"Dodo webhook processing failed: {e}")
        return {"error": str(e)}
