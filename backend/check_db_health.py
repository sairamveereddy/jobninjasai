import os
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

def check_db():
    ROOT_DIR = Path(__file__).parent
    load_dotenv(ROOT_DIR / ".env")
    
    db_url = os.environ.get("DATABASE_URL")
    print(f"DEBUG: Using DATABASE_URL: {db_url}")
    
    if not db_url:
        print("ERROR: DATABASE_URL not found in .env")
        return

    try:
        conn = psycopg2.connect(db_url)
        print("SUCCESS: Connected to database")
        
        cur = conn.cursor()
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = cur.fetchall()
        print(f"Tables found: {[t[0] for t in tables]}")
        
        cur.execute("SELECT COUNT(*) FROM users")
        user_count = cur.fetchone()[0]
        print(f"User count: {user_count}")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"ERROR: Database check failed: {e}")

if __name__ == "__main__":
    check_db()
