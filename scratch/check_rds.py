import psycopg2, os, json
from dotenv import load_dotenv
load_dotenv('backend/.env')
conn = psycopg2.connect(os.environ['DATABASE_URL'])
cur = conn.cursor()

# Check distinct non-null type values
cur.execute("SELECT DISTINCT type FROM jobs WHERE type IS NOT NULL LIMIT 20")
types = [r[0] for r in cur.fetchall()]
print(f"Distinct types: {types}")

# Check distinct contract_type values
cur.execute("SELECT DISTINCT contract_type FROM jobs WHERE contract_type IS NOT NULL LIMIT 20")
ct = [r[0] for r in cur.fetchall()]
print(f"Distinct contract_types: {ct}")

# Check categories
cur.execute("SELECT categories FROM jobs WHERE categories IS NOT NULL LIMIT 5")
cats = [r[0] for r in cur.fetchall()]
print(f"Sample categories: {cats}")

# Check how many have type populated
cur.execute("SELECT count(*) FROM jobs WHERE type IS NOT NULL AND type != ''")
print(f"Jobs with type: {cur.fetchone()[0]}")

cur.execute("SELECT count(*) FROM jobs WHERE contract_type IS NOT NULL AND contract_type != ''")
print(f"Jobs with contract_type: {cur.fetchone()[0]}")

cur.execute("SELECT count(*) FROM jobs WHERE categories IS NOT NULL")
print(f"Jobs with categories: {cur.fetchone()[0]}")

# Check a full sample row
from psycopg2.extras import RealDictCursor
cur2 = conn.cursor(cursor_factory=RealDictCursor)
cur2.execute("SELECT * FROM jobs WHERE type IS NOT NULL LIMIT 1")
row = cur2.fetchone()
if row:
    for k,v in row.items():
        if v is not None:
            print(f"  {k}: {str(v)[:80]}")

conn.close()
