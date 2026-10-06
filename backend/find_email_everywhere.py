import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def find(email):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    cur.execute("""
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
    """)
    columns = cur.fetchall()
    
    found_in = []
    for table, col in columns:
        try:
            cur.execute(f"SELECT COUNT(*) FROM {table} WHERE CAST({col} AS TEXT) LIKE %s", (f"%{email}%",))
            count = cur.fetchone()[0]
            if count > 0:
                found_in.append((table, col, count))
        except Exception:
            conn.rollback()
            continue
            
    print(f"Email {email} found in:")
    for table, col, count in found_in:
        print(f" - {table}.{col}: {count} rows")
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    find('srkreddy452@gmail.com')
