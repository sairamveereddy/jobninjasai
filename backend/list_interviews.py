import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def list_interviews():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute('SELECT id, user_id, created_at FROM interviews')
    rows = cur.fetchall()
    print(f"Total interviews: {len(rows)}")
    for row in rows:
        print(row)
    cur.close()
    conn.close()

if __name__ == "__main__":
    list_interviews()
