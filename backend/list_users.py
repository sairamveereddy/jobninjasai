import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def list_users():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT id, email FROM users ORDER BY id LIMIT 10")
    rows = cur.fetchall()
    for row in rows:
        print(f"ID: {row[0]}, Email: {row[1]}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    list_users()
