import bcrypt
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def verify_db_user():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT email, password_hash FROM users WHERE email = 'srkreddy452@gmail.com'")
    row = cur.fetchone()
    if not row:
        print("User not found")
        return
    
    email, db_hash = row
    print(f"User: {email}, Hash: {db_hash}")
    
    pw = "password123"
    try:
        v = bcrypt.checkpw(pw.encode("utf-8"), db_hash.encode("utf-8"))
        print(f"Verify 'password123': {v}")
    except Exception as e:
        print(f"Error: {e}")
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    verify_db_user()
