import os
import bcrypt
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

db_url = os.environ.get('DATABASE_URL')
engine = create_engine(db_url)

email = 'srkreddy452@gmail.com'
password = 'Veereddy123'
new_hash = hash_password(password)

try:
    with engine.connect() as conn:
        result = conn.execute(text("UPDATE users SET password_hash = :hash WHERE email = :email"), {"hash": new_hash, "email": email})
        conn.commit()
        print(f"Successfully updated password for {email}")
except Exception as e:
    print(f"Error updating password: {e}")
