import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
db_url = os.environ.get('DATABASE_URL')

def apply_migration():
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    try:
        print("Applying migration 02_add_sessions_to_roadmaps.sql...")
        cur.execute("ALTER TABLE roadmaps ADD COLUMN IF NOT EXISTS sessions JSONB DEFAULT '[]'::jsonb;")
        conn.commit()
        print("Migration applied successfully.")
    except Exception as e:
        print(f"Error applying migration: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    apply_migration()
