import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def count():
    load_dotenv('backend/.env')
    client = AsyncIOMotorClient(os.environ['MONGO_URL'], tlsAllowInvalidCertificates=True)
    db = client[os.environ.get('DB_NAME', 'jobninjas')]
    count = await db.users.count_documents({})
    print(f"Total users in MongoDB: {count}")
    
    # Get 5 sample emails
    cursor = db.users.find({}, {"email": 1}).limit(5)
    async for user in cursor:
        print(f"Sample email: {user.get('email')}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(count())
