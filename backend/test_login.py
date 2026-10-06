import requests

def test_login(email, password):
    url = "http://localhost:8000/api/auth/login"
    payload = {
        "email": email,
        "password": password,
        "turnstile_token": "XXXX.DUMMY.TOKEN.XXXX" # Bypassed in dev
    }
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login("srkreddy452@gmail.com", "password123")
