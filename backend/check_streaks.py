import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check(uuid_str):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT * FROM streaks WHERE user_id::text = %s", (uuid_str,))
    rows = cur.fetchall()
    print(f"Streaks for {uuid_str}: {rows}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    check('4627d2ab-9399-4639-b5d6-c41351f4824c')
