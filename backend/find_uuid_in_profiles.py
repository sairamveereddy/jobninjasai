import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def find_uuid_in_profiles(uuid_str):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    cur.execute("SELECT table_name, column_name FROM information_schema.columns WHERE table_name = 'profiles'")
    cols = cur.fetchall()
    
    for _, col in cols:
        try:
            cur.execute(f"SELECT email FROM profiles WHERE CAST({col} AS TEXT) = %s", (uuid_str,))
            row = cur.fetchone()
            if row:
                print(f"Found {uuid_str} in profiles.{col} for email {row[0]}")
        except Exception:
            conn.rollback()
            continue
            
    cur.close()
    conn.close()

if __name__ == "__main__":
    find_uuid_in_profiles('4627d2ab-9399-4639-b5d6-c41351f4824c')
