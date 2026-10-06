import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
db_url = os.environ.get('DATABASE_URL')

if not db_url:
    print("Error: DATABASE_URL not found in environment")
    exit(1)

conn = psycopg2.connect(db_url)
cur = conn.cursor()
try:
    with open('09_user_profiles_updates.sql', 'r', encoding='utf-8') as f:
        sql = f.read()
        cur.execute(sql)
    conn.commit()
    print("Migration 09_user_profiles_updates.sql applied successfully.")
except Exception as e:
    print(f"Error applying migration: {e}")
    conn.rollback()
finally:
    cur.close()
    conn.close()
