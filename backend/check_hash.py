import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_hash(email):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    cur.execute("SELECT password_hash FROM profiles WHERE email = %s", (email,))
    legacy_hash = cur.fetchone()
    print(f"Legacy Hash for {email}: {legacy_hash[0] if legacy_hash else 'No row'}")
    
    cur.execute("SELECT password_hash FROM users WHERE email = %s", (email,))
    new_hash = cur.fetchone()
    print(f"New Hash for {email}: {new_hash[0] if new_hash else 'No row'}")
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    get_hash('srkreddy452@gmail.com')
