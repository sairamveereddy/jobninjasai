import os, psycopg2
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path('backend/.env'))
db_url = os.environ.get('DATABASE_URL')
conn = psycopg2.connect(db_url)
conn.autocommit = True
cur = conn.cursor()
cur.execute("UPDATE ninja_roadmaps SET status = 'inactive' WHERE user_email = 'test@example.com' AND status = 'active'")
print('Deactivated old roadmaps, rows affected:', cur.rowcount)
conn.close()
