import os
import bcrypt
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def fix_user(email, password):
    h = hash_password(password)
    print(f"Hashing {password} for {email} -> {h}")
    with engine.connect() as conn:
        # PostgreSQL specific UPSERT
        conn.execute(text("""
            INSERT INTO users (email, password_hash, name, role, plan, is_verified)
            VALUES (:e, :h, :n, 'admin', 'pro', true)
            ON CONFLICT (email) DO UPDATE 
            SET password_hash = :h, role = 'admin', plan = 'pro', is_verified = true
        """), {"h": h, "e": email, "n": email.split("@")[0]})
        conn.commit()
    print(f"Updated/Created {email} in database.")

if __name__ == "__main__":
    fix_user("srkreddy452@gmail.com", "Veereddy123")
    fix_user("vsairamveereddy@gmail.com", "Admin@123")
