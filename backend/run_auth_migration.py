import psycopg2
import os
from dotenv import load_dotenv

def run_migration():
    load_dotenv()
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found in .env")
        return

    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()
        
        with open("03_add_auth_to_users.sql", "r") as f:
            sql = f.read()
            
        print("Executing migration...")
        cur.execute(sql)
        print("Migration successful!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    run_migration()
