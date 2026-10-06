"""
Script to clean up non-USA jobs from database
Run this once to remove all existing non-USA jobs
"""

import asyncio
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def cleanup_non_usa_jobs():
    """Remove all non-USA jobs from database"""
    # Connect to MongoDB
    mongo_url = os.getenv("MONGO_URL")
    db_name = os.getenv("DB_NAME", "jobninjas")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🧹 Starting non-USA jobs cleanup...")
    
    # List of non-USA country indicators
    non_usa_patterns = [
        "uk", "gb", "united kingdom", "england", "scotland", "wales",
        "canada", "toronto", "vancouver", "montreal",
        "india", "bangalore", "mumbai", "delhi", "hyderabad",
        "australia", "sydney", "melbourne",
        "germany", "berlin", "munich",
        "france", "paris",
        "china", "beijing", "shanghai",
        "japan", "tokyo",
        "singapore",
        "ireland", "dublin",
        "netherlands", "amsterdam"
    ]
    
    # Build regex pattern
    pattern = "|".join(non_usa_patterns)
    
    # Count before cleanup
    total_before = await db.jobs.count_documents({})
    non_usa_count = await db.jobs.count_documents({
        "location": {"$regex": pattern, "$options": "i"}
    })
    
    print(f"📊 Total jobs before cleanup: {total_before}")
    print(f"🌍 Non-USA jobs found: {non_usa_count}")
    
    # Delete non-USA jobs
    result = await db.jobs.delete_many({
        "location": {"$regex": pattern, "$options": "i"}
    })
    
    deleted_count = result.deleted_count
    total_after = await db.jobs.count_documents({})
    
    print(f"✅ Cleanup completed!")
    print(f"🗑️  Deleted: {deleted_count} non-USA jobs")
    print(f"📊 Total jobs after cleanup: {total_after}")
    print(f"🇺🇸 USA jobs remaining: {total_after}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(cleanup_non_usa_jobs())
