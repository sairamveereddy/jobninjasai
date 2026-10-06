import requests
import server

token = server.create_access_token({"sub": "srkreddy452@gmail.com"})
url = "http://127.0.0.1:8000/api/scan/parse"
headers = {"token": token}

files = {"resume": ("dummy.txt", b"Test resume content", "text/plain")}

try:
    response = requests.post(url, headers=headers, files=files)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
