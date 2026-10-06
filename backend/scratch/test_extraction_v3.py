import asyncio
import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from resume_analyzer import extract_resume_data

async def test_extraction():
    load_dotenv()
    
    sample_text = """
    John Doe
    Email: john.doe@example.com
    Phone: 123-456-7890
    LinkedIn: linkedin.com/in/johndoe
    
    Summary: Experienced Software Engineer with 5 years in Python and Java.
    
    Experience:
    Software Engineer, Tech Corp (2018 - Present)
    - Developed high-performance APIs using FastAPI.
    - Optimized database queries by 40%.
    
    Education:
    B.S. Computer Science, University of California (2014-2018)
    
    Skills: Python, Java, SQL, AWS, Docker
    """
    
    print("Starting extraction test...")
    result = await extract_resume_data(sample_text)
    
    import json
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    asyncio.run(test_extraction())
