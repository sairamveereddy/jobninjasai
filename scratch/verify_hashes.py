import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from supabase import create_client
from dotenv import load_dotenv

async def verify():
    load_dotenv('backend/.env')
    sb_url = os.environ.get('SUPABASE_URL')
    sb_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    supabase = create_client(sb_url, sb_key)
    
    # Check users with password_hash
    res = supabase.table("profiles").select("email, password_hash").filter("password_hash", "neq", "").execute()
    print(f"Users in Supabase with password_hash: {len(res.data) if res.data else 0}")
    
    if res.data:
        print(f"Sample repaired user: {res.data[0].get('email')}")
        print(f"Hash present: {bool(res.data[0].get('password_hash'))}")
    else:
        print("No users found with password_hash in Supabase profiles.")

if __name__ == "__main__":
    asyncio.run(verify())
