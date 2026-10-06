import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check_user_data(user_id, uuid):
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("DATABASE_URL not found")
        return
        
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    tables = ['call_results', 'roadmaps', 'interviews', 'call_bookings']
    
    for table in tables:
        try:
            cur.execute(f"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{table}' AND column_name = 'user_id'")
            col_info = cur.fetchone()
            if not col_info:
                print(f"Table {table} has no user_id column")
                continue
                
            col_type = col_info[1]
            
            if 'integer' in col_type:
                cur.execute(f"SELECT COUNT(*) FROM {table} WHERE user_id = %s", (user_id,))
                count = cur.fetchone()[0]
                print(f"{table} (int) count for user {user_id}: {count}")
            elif 'uuid' in col_type or 'text' in col_type:
                cur.execute(f"SELECT COUNT(*) FROM {table} WHERE user_id::text = %s", (uuid,))
                count = cur.fetchone()[0]
                print(f"{table} (uuid/text) count for user {uuid}: {count}")
            else:
                print(f"Unknown type {col_type} for {table}.user_id")
        except Exception as e:
            print(f"Error checking {table}: {e}")
            conn.rollback()
            
    cur.close()
    conn.close()

if __name__ == "__main__":
    check_user_data(2, '891ed464-fdc6-4697-9d6d-e15e3e017eba')
