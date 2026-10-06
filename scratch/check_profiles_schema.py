import psycopg2
import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('backend/.env')

conn=psycopg2.connect(os.environ['DATABASE_URL'])
cur=conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles'")
rds_cols=[r[0] for r in cur.fetchall()]

sb=create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_ROLE_KEY'])
res = sb.table('profiles').select('*').limit(1).execute()
if res.data:
    row = res.data[0]
    sb_cols = list(row.keys())
    missing_in_rds = list(set(sb_cols) - set(rds_cols))
    print(json.dumps({
        'table': 'profiles',
        'rds_cols_count': len(rds_cols),
        'sb_cols_count': len(sb_cols),
        'missing_in_rds': missing_in_rds
    }, indent=2))
else:
    print("No profiles in Supabase!")
cur.close()
conn.close()
