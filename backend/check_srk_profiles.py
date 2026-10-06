import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT id, email FROM profiles WHERE email = 'srkreddy452@gmail.com'")
    rows = cur.fetchall()
    print(f"Profiles for srkreddy452@gmail.com: {rows}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    check()
