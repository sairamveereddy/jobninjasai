import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_transcript():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT transcript FROM interviews WHERE user_id::text = '4627d2ab-9399-4639-b5d6-c41351f4824c' LIMIT 1")
    row = cur.fetchone()
    if row:
        print(row[0])
    else:
        print("No transcript found")
    cur.close()
    conn.close()

if __name__ == "__main__":
    get_transcript()
