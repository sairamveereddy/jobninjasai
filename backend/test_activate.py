import requests
import json
import logging

logging.basicConfig(level=logging.INFO)

url = "http://localhost:8000/api/ninja/v2/activate"
headers = {
    "Content-Type": "application/json"
}

# In AINinjaV2.jsx:
# userId: user?.id || user?.email,
# email: user?.email || '',
# skills: ["Python", "AWS"],
# resume_text: "My resume text"

data = {
    "userId": "test@example.com",
    "email": "test@example.com",
    "skills": ["Python", "AWS"],
    "resume_text": "Sample resume"
}

try:
    response = requests.post(url, headers=headers, json=data)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.text)
except Exception as e:
    print("Error:", str(e))
