import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def count():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute('SELECT COUNT(*) FROM profiles')
    print(f"Total profiles: {cur.fetchone()[0]}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    count()
