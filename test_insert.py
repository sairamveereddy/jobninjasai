import psycopg2
import os
import uuid
from dotenv import load_dotenv

load_dotenv('backend/.env')
DATABASE_URL = os.getenv('DATABASE_URL')

def test_insert():
    email = f"debug_{uuid.uuid4().hex[:6]}@test.com"
    print(f"Attempting to insert user: {email}")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO users 
               (email, password_hash, name, phone, role, plan, is_verified, verification_token, referral_code, referred_by) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) 
               RETURNING id""",
            (email, "hash", "Debug User", "123", "customer", "free", False, "token", "code", None)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        print(f"SUCCESS! User ID: {user_id}")
        conn.close()
    except Exception as e:
        print(f"FAILURE: {e}")

if __name__ == "__main__":
    test_insert()
