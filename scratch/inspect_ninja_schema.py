import os
import psycopg2
from dotenv import load_dotenv
from pathlib import Path

# Load .env
load_dotenv(Path(__file__).parent.parent / 'backend' / '.env')

def inspect_ninja_tables():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found")
        return
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        tables = ['ninja_roadmaps', 'ninja_roadmap_steps', 'user_onboarding_survey']
        
        for table in tables:
            print(f"\n--- {table} Table Columns ---")
            cur.execute(f"""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = '{table}'
                ORDER BY ordinal_position;
            """)
            rows = cur.fetchall()
            if not rows:
                print(f"Table '{table}' NOT FOUND!")
            for row in rows:
                print(f"{row[0]}: {row[1]}")
        
        conn.close()
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    inspect_ninja_tables()
