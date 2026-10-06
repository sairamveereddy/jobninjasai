import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT id, password_hash FROM users WHERE email = 'srkreddy452@gmail.com'")
    row = cur.fetchone()
    print(f"User: {row}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    check()
