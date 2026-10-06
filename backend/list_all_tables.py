import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def list_tables():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    rows = cur.fetchall()
    print(f"Tables: {[r[0] for r in rows]}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    list_tables()
