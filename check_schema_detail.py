import psycopg2
import os

DATABASE_URL = "postgresql://postgres:Veereddy123@database-1.cgdwsogge6mg.us-east-1.rds.amazonaws.com:5432/jobninjas"

def check_schema_detail():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("""
        SELECT column_name, column_default, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'users'
    """)
    rows = cur.fetchall()
    for row in rows:
        print(f"{row[0]}: default={row[1]}, nullable={row[2]}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    check_schema_detail()
