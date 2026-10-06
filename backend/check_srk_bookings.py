import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT * FROM call_bookings WHERE user_id::text = '891ed464-fdc6-4697-9d6d-e15e3e017eba'")
    row = cur.fetchone()
    print(f"Booking: {row}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    check()
