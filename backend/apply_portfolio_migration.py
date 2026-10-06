import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
db_url = os.environ.get('DATABASE_URL')

def apply_migration():
    if not db_url:
        print("Error: DATABASE_URL not found in environment")
        return

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    try:
        migrations = ['04_ai_portfolio.sql', '07_portfolio_v2_updates.sql', '08_portfolio_usage.sql']
        for migration in migrations:
            if os.path.exists(migration):
                print(f"Applying migration {migration}...")
                with open(migration, 'r') as f:
                    sql = f.read()
                    cur.execute(sql)
                print(f"Migration {migration} applied successfully.")
        conn.commit()
    except Exception as e:
        print(f"Error applying migration: {e}")
        conn.rollback()
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    apply_migration()
