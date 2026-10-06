import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_columns_and_types(table_name):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = %s", (table_name,))
    rows = cur.fetchall()
    for row in rows:
        print(f"{row[0]}: {row[1]}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    import sys
    table = sys.argv[1] if len(sys.argv) > 1 else 'users'
    get_columns_and_types(table)
