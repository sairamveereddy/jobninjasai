import os
import httpx
from dotenv import load_dotenv

# Load .env from backend directory
script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(script_dir, ".env")
load_dotenv(dotenv_path)

class VapiService:
    def __init__(self):
        self.api_key = os.getenv("VAPI_API_KEY")
        self.base_url = "https://api.vapi.ai"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def trigger_call(self, phone_number, system_prompt):
        # This is a simplified trigger. Real Vapi usage might involve creating an assistant or using a phone number.
        # Assuming we use the 'call' endpoint.
        payload = {
            "phoneNumberId": os.getenv("VAPI_PHONE_NUMBER_ID"),
            "customer": {
                "number": phone_number
            },
            "assistant": {
                "model": {
                    "provider": "openai",
                    "model": "gpt-4",
                    "messages": [
                        {
                            "role": "system",
                            "content": system_prompt
                        }
                    ]
                }
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{self.base_url}/call/phone", json=payload, headers=self.headers)
            return response.json()
