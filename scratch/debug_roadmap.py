"""
Quick inline test of create_ninja_roadmap to catch the exact failure point.
Run from: jobninjas/ directory
"""
import os, sys
sys.path.insert(0, 'backend')
from dotenv import load_dotenv
load_dotenv('backend/.env')

# Force logging to console
import logging
logging.basicConfig(level=logging.DEBUG, format='%(name)s - %(levelname)s - %(message)s')

from database_service import DatabaseService

steps = [
    {
        "day_number": i,
        "topic": f"Topic {i}",
        "description": f"Desc {i}",
        "notes": f"Notes {i}",
        "topic_category": "General",
        "difficulty": "Medium",
        "estimated_minutes": 60,
        "youtube_links": [],
        "resource_url": "",
        "certifications": [],
        "status": "locked"
    }
    for i in range(1, 5)
]

print("\n=== Testing create_ninja_roadmap ===")
result = DatabaseService.create_ninja_roadmap("srkreddy452@gmail.com", "Data / AI Engineer", steps)
print(f"\n=== Result: {result} ===")
