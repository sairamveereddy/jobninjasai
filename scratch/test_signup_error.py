import os
import asyncio
from supabase import create_client
from dotenv import load_dotenv
import uuid
import datetime

async def test_signup_error():
    load_dotenv('backend/.env')
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    supabase = create_client(url, key)
    
    test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    user_dict = {
        "id": str(uuid.uuid4()),
        "email": test_email,
        "name": "Test User",
        "password_hash": "test-hash",
        "is_verified": False,
        "role": "customer",
        "plan": "free",
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    print(f"Attempting to signup: {test_email}")
    try:
        response = supabase.table("profiles").insert(user_dict).execute()
        print(f"Response: {response.data}")
    except Exception as e:
        print(f"ACTUAL ERROR FROM SUPABASE: {e}")

if __name__ == "__main__":
    asyncio.run(test_signup_error())
