import psycopg2
import os
from dotenv import load_dotenv

def check_columns():
    load_dotenv()
    db_url = os.environ.get("DATABASE_URL")
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        cur.execute("SELECT * FROM streaks LIMIT 0")
        colnames = [desc[0] for desc in cur.description]
        print(f"Users Columns: {colnames}")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_columns()
