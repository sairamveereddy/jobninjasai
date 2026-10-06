import os
from dotenv import load_dotenv

load_dotenv()

print(f"VAPI_API_KEY: {os.getenv('VAPI_API_KEY')}")
print(f"VAPI_ASSISTANT_ID: {os.getenv('VAPI_ASSISTANT_ID')}")
print(f"VAPI_PHONE_NUMBER_ID: {os.getenv('VAPI_PHONE_NUMBER_ID')}")
