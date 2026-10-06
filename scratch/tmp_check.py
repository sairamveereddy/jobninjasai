import psycopg2
import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('backend/.env')

conn=psycopg2.connect(os.environ['DATABASE_URL'])
cur=conn.cursor()
cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'jobs'")
cols=[r[0] for r in cur.fetchall()]

sb=create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_ROLE_KEY'])
job=sb.table('jobs').select('*').limit(1).execute().data[0]

missing_in_rds=list(set(job.keys())-set(cols))

with open('schema_diff.json', 'w') as f:
    json.dump({
        'rds_cols': cols,
        'supabase_cols': list(job.keys()),
        'missing_in_rds': missing_in_rds
    }, f, indent=2)
