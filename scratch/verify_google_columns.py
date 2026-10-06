import os
import asyncio
from supabase import create_client
from dotenv import load_dotenv

async def check_columns():
    load_dotenv('backend/.env')
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
    supabase = create_client(url, key)
    
    try:
        # Fetch one profile specifically looking for metadata or specific columns
        res = supabase.table("profiles").select("*").limit(1).execute()
        if res.data:
            cols = list(res.data[0].keys())
            print(f"Columns found: {cols}")
            print(f"GOOGLE_ID present: {'google_id' in cols}")
            print(f"AUTH_METHOD present: {'auth_method' in cols}")
        else:
            print("No profiles to check. Using an insert attempt to see if it fails.")
            try:
                # Try a partial insert with google_id
                supabase.table("profiles").insert({"email": "test@test.com", "google_id": "test"}).execute()
            except Exception as e:
                print(f"Insert with google_id failed: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_columns())
