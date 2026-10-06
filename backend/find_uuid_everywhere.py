import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def find(uuid_str):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    # Get all tables with columns that might contain UUIDs
    cur.execute("""
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND (column_name LIKE '%id%' OR column_name LIKE '%user%')
    """)
    columns = cur.fetchall()
    
    found_in = []
    for table, col in columns:
        try:
            cur.execute(f"SELECT COUNT(*) FROM {table} WHERE CAST({col} AS TEXT) = %s", (uuid_str,))
            count = cur.fetchone()[0]
            if count > 0:
                found_in.append((table, col, count))
        except Exception:
            conn.rollback()
            continue
            
    print(f"UUID {uuid_str} found in:")
    for table, col, count in found_in:
        print(f" - {table}.{col}: {count} rows")
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    find('4627d2ab-9399-4639-b5d6-c41351f4824c')
    print("-" * 20)
    find('891ed464-fdc6-4697-9d6d-e15e3e017eba')
