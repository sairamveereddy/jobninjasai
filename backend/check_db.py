import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

db_url = os.environ.get('DATABASE_URL')
print(f"Connecting to {db_url.split('@')[1] if db_url and '@' in db_url else 'unknown'}")

engine = create_engine(db_url)
try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, email, name FROM users LIMIT 10"))
        users = result.fetchall()
        print("Total users found:", len(users))
        for user in users:
            print(f"ID: {user.id}, Email: {user.email}, Name: {user.name}")
        
        # Check specifically for the user
        result = conn.execute(text("SELECT id, email, name, password_hash FROM users WHERE email = 'srkreddy452@gmail.com'"))
        user = result.fetchone()
        if user:
            print(f"Target User Found: ID: {user.id}, Email: {user.email}")
            print(f"Has Password Hash: {'Yes' if user.password_hash else 'No'}")
            if user.password_hash:
                print(f"Hash starts with: {user.password_hash[:10]}...")
        else:
            print("Target User NOT Found in users table.")

except Exception as e:
    print(f"Error connecting to DB: {e}")
