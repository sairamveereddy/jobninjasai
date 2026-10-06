import os
import sys
import uuid
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from pathlib import Path

# Load .env from backend/
load_dotenv(Path(__file__).parent.parent / 'backend' / '.env')

def test_roadmap_persistence():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not found - check backend/.env")
        return

    print(f"Connecting to DB...")
    try:
        conn = psycopg2.connect(db_url, connect_timeout=5)
        conn.autocommit = True
        cur = conn.cursor(cursor_factory=RealDictCursor)
        print("Connected OK")
    except Exception as e:
        print(f"Connection FAILED: {e}")
        return

    user_email = "test@example.com"
    target_role = "AI Engineer"
    roadmap_id = str(uuid.uuid4())

    # Test 1: Header insert
    print(f"\n--- Test 1: Insert roadmap header ---")
    try:
        cur.execute(
            "INSERT INTO ninja_roadmaps (id, user_email, target_role, status) VALUES (%s, %s, %s, 'active') RETURNING id",
            (roadmap_id, user_email, target_role)
        )
        row = cur.fetchone()
        print(f"SUCCESS - Header inserted: {row}")
    except Exception as e:
        print(f"FAILED - Header insert error: {e}")
        conn.close()
        return

    # Test 2: Step insert (matching code in create_ninja_roadmap)
    print(f"\n--- Test 2: Insert roadmap step ---")
    step_id = str(uuid.uuid4())
    step_query = """
        INSERT INTO ninja_roadmap_steps 
        (id, roadmap_id, day_number, topic, description, notes, topic_category, difficulty, estimated_minutes, youtube_links, resource_url, certifications, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    step_params = (
        step_id,
        roadmap_id,
        1,
        "Python Basics",
        "Introduction to Python",
        "Study list comprehensions",
        "Programming",
        "Medium",
        60,
        json.dumps([{"url": "https://youtube.com/watch?v=abc"}]),
        "https://python.org",
        json.dumps([]),
        "locked"
    )
    try:
        cur.execute(step_query, step_params)
        print(f"SUCCESS - Step inserted")
    except Exception as e:
        print(f"FAILED - Step insert error: {e}")

    # Test 3: Verify rows
    print(f"\n--- Test 3: Verify stored rows ---")
    try:
        cur.execute("SELECT id, user_email, target_role FROM ninja_roadmaps WHERE id = %s", (roadmap_id,))
        row = cur.fetchone()
        print(f"Roadmap row: {dict(row) if row else 'NOT FOUND'}")

        cur.execute("SELECT id, day_number, topic FROM ninja_roadmap_steps WHERE roadmap_id = %s", (roadmap_id,))
        steps = cur.fetchall()
        print(f"Step rows: {[dict(s) for s in steps]}")
    except Exception as e:
        print(f"Verify FAILED: {e}")

    # Cleanup test data
    try:
        cur.execute("DELETE FROM ninja_roadmaps WHERE id = %s", (roadmap_id,))
        print(f"\nCleanup: Test rows deleted.")
    except Exception as e:
        print(f"\nCleanup error (non-critical): {e}")

    conn.close()

if __name__ == "__main__":
    test_roadmap_persistence()
