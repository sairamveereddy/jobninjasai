import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
db_url = os.environ.get('DATABASE_URL')

def apply_migration(filename):
    with open(filename, 'r') as f:
        sql = f.read()
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    try:
        print(f"Applying migration {filename}...")
        cur.execute(sql)
        conn.commit()
        print("Migration applied successfully.")
    except Exception as e:
        print(f"Error applying migration: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    apply_migration('06_resume_data.sql')
    apply_migration('05_update_profiles.sql')
