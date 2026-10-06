import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

async def diagnose():
    load_dotenv('backend/.env')
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    
    print(f"URL: {url}")
    print(f"Key present: {bool(key)}")
    
    if not url or not key:
        print("Missing credentials")
        return

    try:
        supabase = create_client(url, key)
        print("Client created")
        
        # Try to fetch one user from profiles
        res = supabase.table("profiles").select("*").limit(1).execute()
        print(f"Profiles fetch status: {res.data is not None}")
        if res.data:
            print(f"Found {len(res.data)} users in profiles")
            user = res.data[0]
            print(f"Sample user email: {user.get('email')}")
            print(f"Password hash present: {bool(user.get('password_hash'))}")
        else:
            print("No users found in profiles table!")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(diagnose())
