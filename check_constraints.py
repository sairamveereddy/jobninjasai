import psycopg2
import os

DATABASE_URL = "postgresql://postgres:Veereddy123@database-1.cgdwsogge6mg.us-east-1.rds.amazonaws.com:5432/jobninjas"

def check_constraints():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("""
        SELECT conname, contype, pg_get_constraintdef(oid)
        FROM pg_constraint
        WHERE conrelid = 'users'::regclass;
    """)
    rows = cur.fetchall()
    for row in rows:
        print(f"{row[0]}: {row[1]} {row[2]}")
    cur.close()
    conn.close()

if __name__ == "__main__":
    check_constraints()
