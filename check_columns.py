import psycopg2
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
DATABASE_URL = os.getenv('DATABASE_URL')

try:
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("SELECT column_name, column_default, is_nullable FROM information_schema.columns WHERE table_name = 'users'")
    rows = cur.fetchall()
    print("Table 'users' defaults and nullability:")
    for col, default, nullable in rows:
        print(f"- {col}: Default={default}, Nullable={nullable}")
    conn.close()
except Exception as e:
    print(f"Error: {e}")
