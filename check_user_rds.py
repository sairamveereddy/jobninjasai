
import os
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

# Load env from backend/.env
load_dotenv("backend/.env")

DATABASE_URL = os.getenv("DATABASE_URL")

def check_user(email):
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT id, email, password_hash, role, plan FROM users WHERE email = %s", (email.lower().strip(),))
        user = cur.fetchone()
        conn.close()
        return user
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    email = "srkreddy452@gmail.com"
    user = check_user(email)
    print(f"User check for {email}: {user}")
