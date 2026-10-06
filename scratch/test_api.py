import requests, json

# Test 1: Basic jobs fetch
print("=== Test 1: Basic /api/jobs ===")
r = requests.get("http://localhost:8000/api/jobs?page=1&limit=5")
d = r.json()
print(f"  Status: {r.status_code}")
print(f"  Success: {d.get('success')}")
print(f"  Jobs returned: {len(d.get('jobs', []))}")
p = d.get("pagination", {})
print(f"  Total: {p.get('total')}")
print(f"  Pages: {p.get('pages')}")

# Test 2: Visa filter
print("\n=== Test 2: Visa filter ===")
r2 = requests.get("http://localhost:8000/api/jobs?page=1&limit=5&visa=true")
d2 = r2.json()
p2 = d2.get("pagination", {})
print(f"  Jobs: {len(d2.get('jobs', []))}  Total: {p2.get('total')}")

# Test 3: Full-time filter
print("\n=== Test 3: Full-time filter ===")
r3 = requests.get("http://localhost:8000/api/jobs?page=1&limit=5&type=full_time")
d3 = r3.json()
p3 = d3.get("pagination", {})
print(f"  Jobs: {len(d3.get('jobs', []))}  Total: {p3.get('total')}")

# Test 4: Search filter
print("\n=== Test 4: Search 'data scientist' ===")
r4 = requests.get("http://localhost:8000/api/jobs?page=1&limit=5&search=data+scientist")
d4 = r4.json()
p4 = d4.get("pagination", {})
print(f"  Jobs: {len(d4.get('jobs', []))}  Total: {p4.get('total')}")

# Test 5: Internship filter
print("\n=== Test 5: Internship filter ===")
r5 = requests.get("http://localhost:8000/api/jobs?page=1&limit=5&type=internship")
d5 = r5.json()
p5 = d5.get("pagination", {})
print(f"  Jobs: {len(d5.get('jobs', []))}  Total: {p5.get('total')}")

if d.get('jobs'):
    j = d['jobs'][0]
    print(f"\n=== Sample Job ===")
    print(f"  Title: {j.get('title')}")
    print(f"  Company: {j.get('company')}")
    print(f"  Location: {j.get('location')}")
