import os
import logging
import httpx
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class VapiClient:
    def __init__(self):
        from dotenv import load_dotenv
        import os
        from pathlib import Path
        dotenv_path = Path(__file__).parent.parent / ".env"
        load_dotenv(dotenv_path, override=True)
        self.api_key = os.getenv("VAPI_API_KEY")
        self.assistant_id = os.getenv("VAPI_ASSISTANT_ID")
        self.phone_number_id = os.getenv("VAPI_PHONE_NUMBER_ID")
        self.base_url = "https://api.vapi.ai"
        
        if not self.api_key:
            logger.warning("VAPI_API_KEY is missing from environment")
        else:
            logger.info(f"VAPI_API_KEY is present (starts with {self.api_key[:4]}...)")
            
        if not self.assistant_id:
            logger.warning("VAPI_ASSISTANT_ID is missing from environment")
        else:
            logger.info(f"VAPI_ASSISTANT_ID is present (starts with {self.assistant_id[:4]}...)")
            
        if not self.phone_number_id:
            logger.warning("VAPI_PHONE_NUMBER_ID is missing from environment")
        else:
            logger.info(f"VAPI_PHONE_NUMBER_ID is present (starts with {self.phone_number_id[:4]}...)")

    async def trigger_call(self, phone_number: str, name: str, system_prompt: str, user_id: int) -> Dict[str, Any]:
        """
        Trigger an outbound call via Vapi.
        """
        if not self.api_key or not self.assistant_id or not self.phone_number_id:
            logger.error("Vapi configuration incomplete")
            return {"error": "Vapi config incomplete"}

        url = f"{self.base_url}/call/phone"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "assistantId": self.assistant_id,
            "assistantOverrides": {
                "variableValues": {
                    "name": name,
                    "user_id": str(user_id)
                },
                "model": {
                    "messages": [
                        {
                            "role": "system",
                            "content": system_prompt
                        }
                    ]
                }
            },
            "phoneNumberId": self.phone_number_id,
            "customer": {
                "number": phone_number,
                "name": name
            }
        }

        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(url, json=payload, headers=headers, timeout=30.0)
                resp.raise_for_status()
                return resp.json()
        except Exception as e:
            logger.error(f"Vapi trigger_call failed: {e}")
            if hasattr(e, 'response') and e.response:
                logger.error(f"Vapi error response: {e.response.text}")
            return {"error": str(e)}
