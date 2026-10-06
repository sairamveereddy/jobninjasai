import psycopg2
import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('backend/.env')

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
DATABASE_URL = os.environ.get("DATABASE_URL")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

rds_conn = psycopg2.connect(DATABASE_URL, connect_timeout=15)
rds_conn.autocommit = True

TABLES = [
    "applications",
    "daily_usage",
    "subscriptions",
    "payments",
    "call_bookings",
    "waitlist",
    "byok_keys",
    "webhook_events",
    "status_checks",
    "customer_assignments",
    "scans",
    "interview_resumes",
    "interview_sessions",
    "interview_turns",
    "evaluation_reports",
]

def clean_value(val):
    if val is None: return None
    if isinstance(val, (dict, list)): return json.dumps(val)
    return val

def sync_schema(table_name, supabase_row):
    cur = rds_conn.cursor()
    cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table_name}'")
    rds_cols = [r[0] for r in cur.fetchall()]
    
    if not rds_cols:
        print(f"  Table {table_name} does not exist in RDS! Skipping schema sync.")
        cur.close()
        return

    missing = set(supabase_row.keys()) - set(rds_cols)
    for col in missing:
        val = supabase_row[col]
        col_type = "JSONB" if isinstance(val, (dict, list)) else "TEXT"
        print(f"  Adding missing column {col} ({col_type}) to {table_name}...")
        cur.execute(f'ALTER TABLE "{table_name}" ADD COLUMN IF NOT EXISTS "{col}" {col_type};')
    cur.close()

def migrate_fast():
    print("MIGRATING USER DATA (SKIPPING JOBS)")
    for table in TABLES:
        print(f"\n--- {table} ---")
        try:
            res = supabase.table(table).select("*").range(0, 999).execute()
            rows = res.data
        except Exception as e:
            print(f"  Error fetching {table}: {str(e)[:100]}")
            continue
            
        print(f"  Supabase: {len(rows)} rows found")
        if not rows: continue
        
        sync_schema(table, rows[0])
        
        cur = rds_conn.cursor()
        columns = list(rows[0].keys())
        cols_str = ", ".join([f'"{c}"' for c in columns])
        placeholders = ", ".join(["%s"] * len(columns))
        
        inserted = 0
        skipped = 0
        
        for row in rows:
            values = tuple(clean_value(row.get(col)) for col in columns)
            try:
                cur.execute(f'INSERT INTO "{table}" ({cols_str}) VALUES ({placeholders}) ON CONFLICT DO NOTHING', values)
                if cur.rowcount > 0: inserted += 1
                else: skipped += 1
            except Exception as e:
                skipped += 1
        
        print(f"  RDS: {inserted} inserted, {skipped} skipped")

migrate_fast()
