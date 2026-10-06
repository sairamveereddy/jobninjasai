import psycopg2
import os
import json
from dotenv import load_dotenv
from supabase import create_client

def clean_value(val):
    if val is None: return None
    if isinstance(val, (dict, list)): return json.dumps(val)
    return val

load_dotenv('backend/.env')

conn = psycopg2.connect(os.environ['DATABASE_URL'])
sb = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_ROLE_KEY'])

job = sb.table('jobs').select('*').limit(1).execute().data[0]

cur = conn.cursor()
columns = list(job.keys())
cols_str = ", ".join(columns)
placeholders = ", ".join(["%s"] * len(columns))
values = tuple(clean_value(job.get(col)) for col in columns)

try:
    cur.execute(f"INSERT INTO jobs ({cols_str}) VALUES ({placeholders})", values)
    conn.commit()
    print("Successfully inserted 1 job!")
except Exception as e:
    print(f"Error inserting job: {e}")

