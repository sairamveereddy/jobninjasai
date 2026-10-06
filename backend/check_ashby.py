from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://jobninjas:auF8nRrqAorEwN5v@cluster0.lb7o5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DB_NAME = "jobninjas"

client = MongoClient(MONGO_URL)
db = client[DB_NAME]

count = db.jobs.count_documents({"source": "ashby"})
print(f"ASHBY_COUNT: {count}")
