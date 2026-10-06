import os
import json
import logging
import rds_service
from fastapi import Request, HTTPException
from typing import Dict, Any

logger = logging.getLogger(__name__)

async def handle_vapi_webhook(request: Request) -> Dict[str, Any]:
    """
    Handle incoming webhooks from Vapi.
    Primarily processes 'end-of-call-report' events.
    """
    # 1. Verify webhook secret if configured
    webhook_secret = os.getenv("VAPI_WEBHOOK_SECRET")
    if webhook_secret:
        vapi_signature = request.headers.get("x-vapi-secret")
        if vapi_signature != webhook_secret:
            logger.warning("Vapi webhook: Invalid secret")
            # In production, strict rejection: 
            # raise HTTPException(status_code=401, detail="Invalid signature")

    try:
        payload = await request.json()
        message = payload.get("message", {})
        message_type = message.get("type")
        
        if message_type != "end-of-call-report":
            return {"status": "ignored", "type": message_type}

        call_data = message.get("call", {})
        vapi_call_id = call_data.get("id")
        
        if not vapi_call_id:
            return {"error": "No call ID in payload"}

        # Extract meaningful data
        transcript = message.get("transcript", "")
        summary = message.get("summary", "")
        analysis = message.get("analysis", {})
        scores = analysis.get("structuredData", {})
        
        recording_url = call_data.get("recordingUrl")
        duration = call_data.get("duration", 0)
        ended_reason = call_data.get("endedReason", "unknown")
        
        # 2. Map back to user
        # Vapi includes original request info in payload
        user_id = rds_service.get_user_id_by_call_id(vapi_call_id)

        if not user_id:
            logger.error(f"Vapi webhook: Could not identify user for call {vapi_call_id}")
            return {"error": "User mapping failed"}

        # 3. Update RDS
        rds_service.update_call_result_on_finish(
            vapi_call_id=vapi_call_id,
            transcript=transcript,
            summary=summary,
            scores=scores,
            status="completed",
            recording_url=recording_url,
            duration=int(duration)
        )

        # 4. Update user stats (streak, last completed)
        if ended_reason == "customer-ended-call" or ended_reason == "assistant-ended-call":
            rds_service.increment_user_streak(user_id)

        # 5. Process Skill Verifications
        # Assume Sensei (AI) identifies skills that the user has proven competence in
        verified_skills = scores.get("verified_skills", [])
        if isinstance(verified_skills, list):
            for skill in verified_skills:
                logger.info(f"✅ AI SENSEI verified skill '{skill}' for user {user_id}")
                rds_service.mark_skill_verified(user_id, skill)

        return {"status": "success", "call_id": vapi_call_id}

    except Exception as e:
        logger.error(f"Vapi webhook processing failed: {e}")
        return {"error": str(e)}
