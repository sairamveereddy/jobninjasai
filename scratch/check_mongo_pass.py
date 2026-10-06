import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def check():
    load_dotenv('backend/.env')
    client = AsyncIOMotorClient(os.environ['MONGO_URL'], tlsAllowInvalidCertificates=True)
    db = client[os.environ.get('DB_NAME', 'jobninjas')]
    user = await db.users.find_one({'email': 'testuser71@test.com'})
    if user:
        print(f"User keys: {list(user.keys())}")
        print(f"Has password_hash: {'password_hash' in user}")
        print(f"Password hash value present: {bool(user.get('password_hash'))}")
    else:
        print("User not found in MongoDB")
    client.close()

if __name__ == "__main__":
    asyncio.run(check())
