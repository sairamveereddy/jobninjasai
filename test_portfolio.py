import requests
import json

url = "http://localhost:8002"

res = requests.post(f"{url}/api/auth/login", json={"email": "srkreddy452@gmail.com", "password": "password123"})
if res.status_code != 200:
    print("Login failed", res.text)
    exit(1)

token = res.json().get("access_token")

res = requests.get(f"{url}/api/portfolio", headers={"Authorization": f"Bearer {token}"})
if res.status_code != 200:
    print("Get portfolio failed", res.text)
    exit(1)

portfolio = res.json()
print("Portfolio:", json.dumps(portfolio, indent=2))

if "public_id" in portfolio:
    pub_res = requests.get(f"{url}/api/portfolio/public/{portfolio['public_id']}?preview=true")
    if pub_res.status_code != 200:
        print("Get public portfolio failed", pub_res.text)
    else:
        print("Public:", json.dumps(pub_res.json(), indent=2))
