import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def init_db():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found in .env")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        schema_path = os.path.join(script_dir, "schema.sql")
        
        with open(schema_path, "r") as f:
            schema = f.read()
            
        cur.execute(schema)
        conn.commit()
        print("Database initialized successfully!")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error initializing database: {e}")

if __name__ == "__main__":
    init_db()
