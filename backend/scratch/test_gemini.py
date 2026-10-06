import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

async def test_gemini():
    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("No GOOGLE_API_KEY or GEMINI_API_KEY found")
        return
    
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    try:
        response = await asyncio.to_thread(model.generate_content, "Hi")
        print(f"Gemini Status: Success")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Gemini Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
