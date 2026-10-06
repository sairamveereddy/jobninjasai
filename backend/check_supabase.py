from supabase_service import SupabaseService
import os
from dotenv import load_dotenv

load_dotenv()

def check_supabase_user(email):
    print(f"--- Checking Supabase for: {email} ---")
    user = SupabaseService.get_user_by_email(email)
    if user:
        print(f"Supabase User found:")
        print(f"  ID: {user.get('id')}")
        print(f"  Email: {user.get('email')}")
        print(f"  Hash: {user.get('password_hash')}")
        print(f"  Raw: {user}")
    else:
        print("User not found in Supabase.")

if __name__ == "__main__":
    check_supabase_user('srkreddy452@gmail.com')
