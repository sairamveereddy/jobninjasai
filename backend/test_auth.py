import requests
import jwt
from datetime import datetime, timedelta, timezone

# Configuration
URL = "http://127.0.0.1:8000/api/ninja/v2/dashboard" # Another endpoint using get_current_user
JWT_SECRET = "dev-secret-key-do-not-use-in-prod"
JWT_ALGORITHM = "HS256"
USER_EMAIL = "srkreddy452@gmail.com"

# Generate Token
payload = {
    "sub": USER_EMAIL,
    "exp": datetime.now(timezone.utc) + timedelta(hours=1)
}
token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# Prepare Request
# This endpoint uses Query param for email but Depends(get_current_user)
# Wait, let's check ninja_v2_dashboard signature
# async def ninja_v2_dashboard(email: str = Query(...), current_user: dict = Depends(get_current_user)):

params = {"email": USER_EMAIL}
headers = {"token": token}

print(f"Calling {URL}...")
try:
    response = requests.get(URL, headers=headers, params=params)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")
