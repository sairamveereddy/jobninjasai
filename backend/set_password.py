import psycopg2
import os
from dotenv import load_dotenv
import bcrypt

def set_password(email, password):
    load_dotenv()
    db_url = os.environ.get("DATABASE_URL")
    
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute(
            "UPDATE users SET password_hash = %s WHERE email = %s",
            (hashed, email.lower().strip())
        )
        conn.commit()
        print(f"Successfully updated password for {email}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        set_password(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python set_password.py <email> <password>")
