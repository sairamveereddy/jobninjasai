import requests
import jwt
from datetime import datetime, timedelta, timezone

# Configuration
URL = "http://127.0.0.1:8001/api/scan/parse"
JWT_SECRET = "dev-secret-key-do-not-use-in-prod"
JWT_ALGORITHM = "HS256"
USER_EMAIL = "srkreddy452@gmail.com"

# Generate Token
payload = {
    "sub": USER_EMAIL,
    "exp": datetime.now(timezone.utc) + timedelta(hours=1)
}
token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

print(f"Generated Token: {token}")

# Test Resume Data
resume_content = """
Sairam Reddy
Email: srkreddy452@gmail.com
Phone: +91 9876543210
Experience:
- Senior Software Engineer at TechCorp (2020 - Present)
  Developed high-scale AI systems using Python and FastAPI.
- Software Engineer at StartUp Inc (2018 - 2020)
  Built React dashboards and Node.js microservices.
Education:
- B.Tech in Computer Science, IIT Bombay (2014 - 2018)
Skills: Python, React, FastAPI, AWS, Docker
"""

# Prepare Request
headers = {"token": token}
files = {"resume": ("resume.txt", resume_content, "text/plain")}

print(f"Calling {URL}...")
try:
    response = requests.post(URL, headers=headers, files=files)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")
