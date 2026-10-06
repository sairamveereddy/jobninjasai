import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def run_migration():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        # Try finding it in the .env file directly if load_dotenv didn't work as expected
        with open(".env", "r") as f:
            for line in f:
                if line.startswith("DATABASE_URL="):
                    db_url = line.split("=", 1)[1].strip().strip('"').strip("'")
                    break
    
    if not db_url:
        print("DATABASE_URL not found")
        return

    try:
        conn = psycopg2.connect(db_url)
        with conn.cursor() as cur:
            migration_path = "07_portfolio_v2_updates.sql"
            with open(migration_path, "r") as f:
                sql = f.read()
                cur.execute(sql)
                conn.commit()
                print("Portfolio v2 updates applied successfully!")
    except Exception as e:
        print(f"Error applying migration: {e}")
    finally:
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    run_migration()
