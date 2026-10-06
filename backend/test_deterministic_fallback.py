import asyncio
import json
import os
from unittest.mock import patch, MagicMock

# Mock environment before imports
os.environ['GROQ_API_KEY'] = 'test_key'
os.environ['GOOGLE_API_KEY'] = 'test_key'

from resume_analyzer import extract_resume_data

SAMPLE_RESUME = """
Sairam Reddy
Email: srkreddy452@gmail.com
Phone: +91 9876543210
Location: Hyderabad, India

Experience:
Senior Software Engineer | TechCorp
2020 - Present
- Developed high-scale AI systems using Python and FastAPI.
- Improved system performance by 40%.

Software Engineer | StartUp Inc
2018 - 2020
- Built React dashboards and Node.js microservices.

Education:
B.Tech in Computer Science | IIT Bombay
2014 - 2018

Skills: Python, React, FastAPI, AWS, Docker
"""

async def test_fallback():
    print("Testing Deterministic Fallback...")
    
    # Mock unified_api_call to return None (simulating AI failure)
    with patch('resume_analyzer.unified_api_call', return_value=None):
        result = await extract_resume_data(SAMPLE_RESUME)
        
        print("\nFallback Result:")
        print(json.dumps(result, indent=2))
        
        # Basic assertions
        assert result.get('is_fallback') is True
        assert result['person']['fullName'] == 'Sairam Reddy'
        assert result['person']['email'] == 'srkreddy452@gmail.com'
        assert len(result['employment_history']) == 2
        assert result['employment_history'][0]['company'] == 'TechCorp'
        assert 'IIT Bombay' in result['education'][0]['school']
        
        print("\n[SUCCESS] Fallback test passed!")

if __name__ == "__main__":
    asyncio.run(test_fallback())
