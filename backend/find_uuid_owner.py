import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def find_owner(uuid_str):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    print(f"Searching for owner of {uuid_str}...")
    
    cur.execute("SELECT email FROM profiles WHERE id::text = %s", (uuid_str,))
    profile = cur.fetchone()
    print(f"Profiles table: {profile}")
    
    cur.execute("SELECT email FROM users WHERE cognito_id = %s", (uuid_str,))
    user_cognito = cur.fetchone()
    print(f"Users table (cognito_id): {user_cognito}")
    
    # Also check if it's the email itself (unlikely but who knows)
    cur.execute("SELECT id, email FROM users WHERE email = %s", (uuid_str,))
    user_email = cur.fetchone()
    print(f"Users table (email): {user_email}")
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    find_owner('4627d2ab-9399-4639-b5d6-c41351f4824c')
