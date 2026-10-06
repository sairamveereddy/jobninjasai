import sys
import os
sys.path.append(os.path.join(os.getcwd(), "backend"))
import rds_service
import uuid

email = f"test_{uuid.uuid4().hex[:6]}@example.com"
print(f"Testing create_user for {email}")
user = rds_service.create_user(
    email=email,
    password_hash="testhash",
    name="Test User",
    verification_token="testtoken",
    role="customer",
    plan="free"
)
if user:
    print(f"SUCCESS: Created user ID {user.get('id')}")
else:
    print("FAILED: create_user returned None")
