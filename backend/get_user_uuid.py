import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_uuid(email):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT id FROM profiles WHERE email = %s", (email,))
    row = cur.fetchone()
    if row:
        print(f"UUID: {row[0]}")
    else:
        print("No profile found")
    cur.close()
    conn.close()

if __name__ == "__main__":
    get_uuid('srkreddy452@gmail.com')
