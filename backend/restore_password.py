import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def restore_password(email):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    # Get legacy hash
    cur.execute("SELECT password_hash FROM profiles WHERE email = %s", (email,))
    row = cur.fetchone()
    if not row or not row[0]:
        print("No legacy hash found")
        return
    
    legacy_hash = row[0]
    
    # Update users table
    cur.execute("UPDATE users SET password_hash = %s, is_verified = TRUE WHERE email = %s", (legacy_hash, email))
    conn.commit()
    print(f"Restored legacy password hash for {email}")
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    restore_password('srkreddy452@gmail.com')
