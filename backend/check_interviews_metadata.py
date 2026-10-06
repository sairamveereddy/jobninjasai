import psycopg2
import os
from dotenv import load_dotenv
import json

load_dotenv()

def check():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute('SELECT id, user_id, metadata FROM interviews')
    rows = cur.fetchall()
    for row in rows:
        print(f"ID: {row[0]}, UserID: {row[1]}, Metadata: {json.dumps(row[2])}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    check()
