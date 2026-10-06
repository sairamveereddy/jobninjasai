import requests

API_URL = "http://localhost:8000"

def test_login(email, password):
    print(f"Attempting login for {email}...")
    try:
        response = requests.post(f"{API_URL}/api/auth/login", json={
            "email": email,
            "password": password,
            "turnstile_token": "local-bypass"
        })
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login("srkreddy452@gmail.com", "Veereddy123")
