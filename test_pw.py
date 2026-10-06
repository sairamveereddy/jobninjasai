
import bcrypt
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
DATABASE_URL = os.getenv('DATABASE_URL')

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

new_hash = hash_password('Veereddy123')
cur.execute('UPDATE users SET password_hash = %s WHERE email = %s', (new_hash, 'srkreddy452@gmail.com'))
conn.commit()

cur.close()
conn.close()

print('Password explicitly reset to Veereddy123 just now.')

