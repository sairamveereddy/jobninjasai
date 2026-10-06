import psycopg2
import os
import json
from dotenv import load_dotenv

load_dotenv()

def repair():
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor()
    
    email = 'srkreddy452@gmail.com'
    user_id = 2
    legacy_uuid = '4627d2ab-9399-4639-b5d6-c41351f4824c'
    
    try:
        print(f"Starting repair for {email} (ID: {user_id})...")
        
        # 1. Reset password hash to force re-migration
        cur.execute("UPDATE users SET password_hash = NULL, cognito_id = %s, is_verified = TRUE WHERE id = %s", (legacy_uuid, user_id))
        print("[OK] Reset password hash and updated cognito_id.")
        
        # 2. Skip streaks for now (UUID constraint)
        print("[INFO] Skipping streaks migration (UUID based table).")
        
        # 3. Migrate interviews to call_results
        cur.execute("SELECT created_at, metadata, transcript, feedback FROM interviews WHERE user_id = %s", (legacy_uuid,))
        interviews = cur.fetchall()
        print(f"Found {len(interviews)} legacy interviews.")
        
        count = 0
        for created_at, metadata, transcript, feedback in interviews:
            # Check if already migrated
            cur.execute("SELECT id FROM call_results WHERE user_id = %s AND created_at = %s", (user_id, created_at))
            if cur.fetchone():
                continue
                
            score = 85
            if metadata:
                try:
                    if isinstance(metadata, dict):
                        score = metadata.get('score', 85)
                    else:
                        m = json.loads(metadata)
                        score = m.get('score', 85)
                except:
                    pass
            
            fb_text = ""
            if feedback:
                try:
                    if isinstance(feedback, (dict, list)):
                        fb_text = json.dumps(feedback)
                    else:
                        fb_text = str(feedback)
                except:
                    fb_text = str(feedback)
            
            cur.execute(
                "INSERT INTO call_results (user_id, created_at, score, transcript, feedback) VALUES (%s, %s, %s, %s, %s)",
                (user_id, created_at, score, transcript, fb_text)
            )
            count += 1
            
        print(f"[OK] Migrated {count} interviews to call_results.")
        
        conn.commit()
        print("\nRepair complete successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Error during repair: {e}")
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    repair()
