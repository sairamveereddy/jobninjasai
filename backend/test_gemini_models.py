import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
key = os.environ.get('GOOGLE_API_KEY') or os.environ.get('GEMINI_API_KEY')
print(f"Using key: {key[:5]}...")
genai.configure(api_key=key)

models = ['gemini-2.0-flash', 'gemini-flash-latest', 'gemini-1.5-flash', 'gemini-pro', 'gemini-2.0-flash-lite']

for m in models:
    try:
        print(f"Testing {m}...")
        model = genai.GenerativeModel(m)
        response = model.generate_content("hi")
        print(f"Success: {m}")
        print(f"Response: {response.text}")
        break
    except Exception as e:
        print(f"Failed {m}: {e}")
