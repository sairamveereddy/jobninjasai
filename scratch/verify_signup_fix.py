import requests
import uuid
import sys

def verify_signup_fix():
    # Attempt a mock signup
    url = "http://localhost:8000/api/auth/signup"
    email = f"verify_{uuid.uuid4().hex[:6]}@example.com"
    payload = {
        "email": email,
        "password": "Password123!",
        "name": "Verification User",
        "turnstile_token": "any-invalid-token-should-work-now"
    }
    
    print(f"Testing signup with: {email}")
    try:
        response = requests.post(url, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        if response.status_code == 200:
            print("✅ SIGNUP SUCCESSFUL (Turnstile bypass verified)")
        else:
            print(f"❌ SIGNUP FAILED: {response.text}")
    except Exception as e:
        print(f"Connection error: {e}. (Ensure server is running or check logic)")

if __name__ == "__main__":
    verify_signup_fix()
