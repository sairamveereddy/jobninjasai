import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

async def inspect():
    load_dotenv('backend/.env')
    client = AsyncIOMotorClient(os.environ['MONGO_URL'], tlsAllowInvalidCertificates=True)
    db = client[os.environ.get('DB_NAME', 'jobninjas')]
    user = await db.users.find_one({})
    if user:
        print(f"User keys: {list(user.keys())}")
        for k, v in user.items():
            if 'pass' in k.lower():
                print(f"Found field '{k}' with value type: {type(v)}")
    else:
        print("No users found.")
    client.close()

if __name__ == "__main__":
    asyncio.run(inspect())
