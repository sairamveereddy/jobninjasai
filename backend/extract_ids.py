import json
import os

with open('backend/user_info_dump.json', 'rb') as f:
    content = f.read().decode('utf-16')
    data = json.loads(content)
    
print(f"Users ID: {data.get('user', {}).get('id')}")
print(f"User Profile User ID: {data.get('user_profile', {}).get('user_id')}")
print(f"Legacy Profile ID: {data.get('legacy_profile', {}).get('id')}")
print(f"Legacy Profile Email: {data.get('legacy_profile', {}).get('email')}")
