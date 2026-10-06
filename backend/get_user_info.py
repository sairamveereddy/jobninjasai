import psycopg2
import os
from dotenv import load_dotenv
import json
import psycopg2.extras

load_dotenv()

def get_full_user_context(email):
    conn = psycopg2.connect(os.getenv('DATABASE_URL'))
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    context = {}
    
    # User info
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    context['user'] = cur.fetchone()
    
    # Profile info (user_profiles table)
    try:
        cur.execute("SELECT * FROM user_profiles WHERE user_id = (SELECT id FROM users WHERE email = %s)", (email,))
        context['user_profile'] = cur.fetchone()
    except:
        conn.rollback()
        context['user_profile'] = "Error"
    
    # Legacy Profile info (profiles table)
    try:
        cur.execute("SELECT * FROM profiles WHERE email = %s", (email,))
        context['legacy_profile'] = cur.fetchone()
    except:
        conn.rollback()
        context['legacy_profile'] = "Error"
    
    print(json.dumps(context, indent=2, default=str))
    
    cur.close()
    conn.close()

if __name__ == "__main__":
    get_full_user_context('srkreddy452@gmail.com')
