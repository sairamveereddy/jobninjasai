import rds_service
import logging

logging.basicConfig(level=logging.INFO)

def test_create():
    try:
        user = rds_service.create_user(
            email="debug_tester@example.com",
            password_hash="test_hash",
            name="Debug Tester",
            phone="1234567890",
            role="customer",
            plan="free"
        )
        print(f"User created: {user}")
    except Exception as e:
        print(f"Exception in test_create: {e}")

if __name__ == "__main__":
    test_create()
