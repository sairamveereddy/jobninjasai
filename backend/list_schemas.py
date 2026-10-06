import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def list_schemas():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT schema_name FROM information_schema.schemata")
    rows = cur.fetchall()
    for row in rows:
        print(row[0])
    cur.close()
    conn.close()

if __name__ == "__main__":
    list_schemas()
