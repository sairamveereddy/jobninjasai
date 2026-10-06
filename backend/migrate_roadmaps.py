import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def migrate():
    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cur = conn.cursor()
    
    print("Migrating roadmaps table...")
    
    # Add sessions column if it doesn't exist
    cur.execute("""
        DO $$ 
        BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='roadmaps' AND column_name='sessions') THEN
                ALTER TABLE roadmaps ADD COLUMN sessions JSONB DEFAULT '[]'::jsonb;
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='roadmaps' AND column_name='status') THEN
                ALTER TABLE roadmaps ADD COLUMN status VARCHAR(20) DEFAULT 'active';
            END IF;
        END $$;
    """)
    
    conn.commit()
    cur.close()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
