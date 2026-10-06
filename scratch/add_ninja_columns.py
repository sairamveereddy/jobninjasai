import psycopg2
import os
from dotenv import load_dotenv

def migrate():
    # Load environment variables
    load_dotenv('backend/.env')
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("Error: DATABASE_URL not found in backend/.env")
        return

    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        print("Adding columns to ninja_roadmap_steps...")
        
        # Add topic_category
        cur.execute("""
            ALTER TABLE ninja_roadmap_steps 
            ADD COLUMN IF NOT EXISTS topic_category character varying;
        """)
        
        # Add difficulty
        cur.execute("""
            ALTER TABLE ninja_roadmap_steps 
            ADD COLUMN IF NOT EXISTS difficulty character varying;
        """)
        
        # Add estimated_minutes
        cur.execute("""
            ALTER TABLE ninja_roadmap_steps 
            ADD COLUMN IF NOT EXISTS estimated_minutes integer;
        """)
        
        conn.commit()
        print("Successfully added columns to ninja_roadmap_steps.")
        
        # Verify schema
        cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ninja_roadmap_steps'")
        columns = cur.fetchall()
        print("\nUpdated ninja_roadmap_steps schema:")
        for col in columns:
            print(f"  {col[0]}: {col[1]}")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error during migration: {e}")

if __name__ == "__main__":
    migrate()
