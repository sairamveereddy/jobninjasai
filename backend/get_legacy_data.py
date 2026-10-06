import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_legacy_data(email):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    # Check roadmaps
    cur.execute("SELECT COUNT(*) FROM roadmaps WHERE user_id = 2")
    print(f"Roadmaps count for user ID 2: {cur.fetchone()[0]}")
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    get_legacy_data('srkreddy452@gmail.com')
