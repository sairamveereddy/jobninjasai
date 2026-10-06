import json
try:
    with open('assistants.json', 'rb') as f:
        content = f.read().decode('utf-16')
    assistants = json.loads(content)
    print("ASSISTANTS:")
    for a in assistants:
        print(f"ID: {a.get('id')}, Name: {a.get('name')}")
except Exception as e:
    print(f"Error reading assistants: {e}")

try:
    with open('phone_numbers.json', 'rb') as f:
        content = f.read().decode('utf-16')
    phones = json.loads(content)
    print("\nPHONE NUMBERS:")
    for p in phones:
        print(f"ID: {p.get('id')}, Number: {p.get('number')}")
except Exception as e:
    print(f"Error reading phones: {e}")
