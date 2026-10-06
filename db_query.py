import psycopg2
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
DATABASE_URL = os.getenv('DATABASE_URL')

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("SELECT email, password_hash FROM users")
    rows = cur.fetchall()
    print("Users and hashes:")
    for email, phash in rows:
        print(f"- {email}: {phash}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
