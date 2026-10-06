import psycopg2
import os
import bcrypt
from dotenv import load_dotenv

load_dotenv()

def inspect_user(email):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    print(f"--- Inspecting user: {email} ---")
    
    # Check users table
    cur.execute("SELECT id, email, password_hash, name, role, is_verified FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    
    if not user:
        print(f"User {email} not found in RDS 'users' table.")
    else:
        u_id, u_email, u_hash, u_name, u_role, u_verified = user
        print(f"RDS User found:")
        print(f"  ID: {u_id}")
        print(f"  Email: {u_email}")
        print(f"  Hash: {u_hash}")
        print(f"  Name: {u_name}")
        print(f"  Role: {u_role}")
        print(f"  Verified: {u_verified}")
        
        if u_hash:
            print(f"  Hash length: {len(u_hash)}")
            print(f"  Hash starts with $2b$: {u_hash.startswith('$2b$')}")
            
            # Test some common passwords (just in case)
            test_pws = ["password123", "Admin@123", "SRK@123"]
            for pw in test_pws:
                try:
                    v = bcrypt.checkpw(pw.encode("utf-8"), u_hash.encode("utf-8"))
                    print(f"  Test verify '{pw}': {v}")
                except Exception as e:
                    print(f"  Error verifying '{pw}': {e}")
        else:
            print("  No password hash found in RDS.")

    # Check ninja_plans table
    print("\n--- Checking ninja_plans ---")
    cur.execute("SELECT * FROM ninja_plans WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))
    plan = cur.fetchone()
    if plan:
        print(f"  Plan: {plan}")
    else:
        print("  No plan found for user in ninja_plans.")

    cur.close()
    conn.close()

if __name__ == "__main__":
    inspect_user('srkreddy452@gmail.com')
