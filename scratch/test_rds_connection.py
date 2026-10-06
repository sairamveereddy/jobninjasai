import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from database_service import DatabaseService
from dotenv import load_dotenv

load_dotenv('backend/.env')

def test_connection():
    print("Testing RDS Connection...")
    print(f"DATABASE_URL: {os.getenv('DATABASE_URL')[:20]}...")
    try:
        result = DatabaseService.execute_query("SELECT 1 as connected", fetch=True)
        print(f"Connection Successful! Result: {result}")
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    test_connection()
