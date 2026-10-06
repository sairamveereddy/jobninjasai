import bcrypt

password = "password123"
hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
print(f"Hashed: {hashed}")

verified = bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
print(f"Verified: {verified}")
