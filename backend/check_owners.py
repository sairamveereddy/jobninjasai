import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check_owners():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    tables = ['call_results', 'roadmaps', 'interviews', 'call_bookings']
    
    for table in tables:
        print(f"\nOwners in {table}:")
        cur.execute(f"SELECT DISTINCT user_id FROM {table}")
        rows = cur.fetchall()
        for row in rows:
            user_id = row[0]
            # Try to resolve to email
            email = "Unknown"
            try:
                if isinstance(user_id, int):
                    cur.execute("SELECT email FROM users WHERE id = %s", (user_id,))
                else:
                    cur.execute("SELECT email FROM profiles WHERE id::text = %s", (str(user_id),))
                res = cur.fetchone()
                if res:
                    email = res[0]
            except:
                pass
            print(f"  ID: {user_id} -> Email: {email}")
            
    cur.close()
    conn.close()

if __name__ == "__main__":
    check_owners()
