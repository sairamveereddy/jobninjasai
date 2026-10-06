import psycopg2
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

conn=psycopg2.connect(os.environ['DATABASE_URL'])
conn.autocommit = True
cur=conn.cursor()

alter_statements = [
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_id TEXT;",
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min TEXT;",
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max TEXT;",
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS contract_type TEXT;",
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source_url TEXT;",
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS posted_at TIMESTAMPTZ;",
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS keywords JSONB;",
    "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hr_contacts JSONB;"
]

for stmt in alter_statements:
    print(f"Executing: {stmt}")
    cur.execute(stmt)

print("Jobs schema altered successfully.")
