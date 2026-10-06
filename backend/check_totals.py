import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check_totals():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    tables = ['call_results', 'roadmaps', 'interviews', 'call_bookings', 'users', 'profiles', 'evaluations', 'reports', 'call_attempts', 'call_schedules']
    
    for table in tables:
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        print(f"{table}: {cur.fetchone()[0]}")
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    check_totals()
