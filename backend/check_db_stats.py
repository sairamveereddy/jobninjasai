import os
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

def check_db_stats():
    ROOT_DIR = Path(__file__).parent
    load_dotenv(ROOT_DIR / ".env")
    db_url = os.environ.get("DATABASE_URL")
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute("SELECT COUNT(*) FROM call_results")
        count = cur.fetchone()[0]
        print(f"Total call_results: {count}")
        
        cur.execute("SELECT email, COUNT(*) FROM call_results cr JOIN users u ON cr.user_id = u.id GROUP BY email")
        rows = cur.fetchall()
        for row in rows:
            print(f"User {row[0]}: {row[1]} calls")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check_db_stats()
