import psycopg2, os
from dotenv import load_dotenv
load_dotenv('backend/.env')

DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    print("DATABASE_URL not found in backend/.env")
    exit(1)

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

def check_table(table_name):
    print(f"\n--- Checking table: {table_name} ---")
    try:
        cur.execute(f"""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = '{table_name}'
            ORDER BY ordinal_position
        """)
        columns = cur.fetchall()
        if not columns:
            print(f"Table '{table_name}' not found.")
            return
        for col in columns:
            print(f"  {col[0]}: {col[1]}")
    except Exception as e:
        print(f"Error checking table {table_name}: {e}")

check_table('ninja_roadmaps')
check_table('ninja_roadmap_steps')

conn.close()
