import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_type(table_name, col_name):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT data_type FROM information_schema.columns WHERE table_name = %s AND column_name = %s", (table_name, col_name))
    row = cur.fetchone()
    print(f"Type of {table_name}.{col_name}: {row[0] if row else 'Not found'}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    get_type('call_bookings', 'user_id')
