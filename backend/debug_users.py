import psycopg2
import os
from dotenv import load_dotenv

def check_users():
    load_dotenv()
    db_url = os.environ.get("DATABASE_URL")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute("SELECT id, email, password_hash IS NOT NULL as has_password, name FROM users LIMIT 10")
        users = cur.fetchall()
        print("RDS Users:")
        for u in users:
            print(u)
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_users()
