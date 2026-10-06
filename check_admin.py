import psycopg2, os, bcrypt
from dotenv import load_dotenv

load_dotenv('backend/.env')
DB = os.getenv('DATABASE_URL')

conn = psycopg2.connect(DB)
cur = conn.cursor()

email = 'srkreddy452@gmail.com'
cur.execute("SELECT password_hash FROM users WHERE email = %s", (email,))
row = cur.fetchone()
stored_hash = row[0]
conn.close()

print(f"Stored hash: {stored_hash!r}")
print()

# Test passwords - print result as plain text
test_passwords = ['Veereddy123', 'veereddy123', 'Srkreddy123', 'srkreddy123', 'admin123', 'Admin123', 'Reddy123']
for pwd in test_passwords:
    try:
        match = bcrypt.checkpw(pwd.encode('utf-8'), stored_hash.encode('utf-8'))
        print(f"  '{pwd}' -> {'MATCH' if match else 'no match'}")
    except Exception as e:
        print(f"  '{pwd}' -> ERROR: {e}")
