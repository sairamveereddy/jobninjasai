import psycopg2
import os
from dotenv import load_dotenv
import psycopg2.extras
from datetime import datetime
import json

load_dotenv()

def repair_user(email):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    try:
        # 1. Get legacy profile
        cur.execute("SELECT * FROM profiles WHERE email = %s", (email,))
        legacy = cur.fetchone()
        if not legacy:
            print(f"No legacy profile found for {email}")
            return

        # 2. Get current user
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        if not user:
            print(f"User {email} not found in users table")
            return
        
        user_id = user['id']
        print(f"Repairing user ID {user_id} ({email})...")

        # 3. Update users table
        cur.execute("""
            UPDATE users 
            SET plan = %s, role = %s, is_verified = %s
            WHERE id = %s
        """, (legacy['plan'], legacy['role'], True, user_id))
        
        # 4. Update user_profiles table
        # Extract current role from experience if possible
        current_role = "AI Engineer" # Fallback
        if legacy['experience'] and len(legacy['experience']) > 0:
            if isinstance(legacy['experience'], list):
                current_role = legacy['experience'][0].get('title', current_role)
            elif isinstance(legacy['experience'], str):
                try:
                    exp = json.loads(legacy['experience'])
                    if exp and len(exp) > 0:
                        current_role = exp[0].get('title', current_role)
                except:
                    pass

        # Wrap "current_role" and "target_role" in quotes because they are reserved words or just good practice
        cur.execute("""
            UPDATE user_profiles 
            SET "current_role" = %s, "target_role" = %s, "resume_text" = %s, "plan_type" = %s
            WHERE user_id = %s
        """, (current_role, legacy['target_role'], legacy['resume_text'] or "placeholder", legacy['plan'], user_id))
        
        # 5. Update/Create ninja_plans
        cur.execute("SELECT id FROM ninja_plans WHERE user_id = %s", (user_id,))
        plan = cur.fetchone()
        
        # Determine plan tier
        plan_tier = 'free'
        if legacy['plan'] == 'ninja-pro' or legacy['subscription_tier'] == 'pro':
            plan_tier = 'pro'
            
        if plan:
            cur.execute("""
                UPDATE ninja_plans 
                SET plan_tier = %s, subscription_status = %s, calls_remaining = %s, 
                    billing_period_end = %s, updated_at = NOW()
                WHERE user_id = %s
            """, (plan_tier, 'active', legacy['credits_balance'] or 10, legacy['subscription_expires_at'], user_id))
        else:
            cur.execute("""
                INSERT INTO ninja_plans (user_id, plan_tier, subscription_status, calls_remaining, billing_period_end)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, plan_tier, 'active', legacy['credits_balance'] or 10, legacy['subscription_expires_at']))
            
        conn.commit()
        print("Success: User data repaired successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"Error during repair: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    repair_user('srkreddy452@gmail.com')
