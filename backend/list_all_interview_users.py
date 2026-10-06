import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def list_users():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT user_id FROM interviews")
    rows = cur.fetchall()
    print(f"User IDs in interviews: {rows}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    list_users()
