import os
import asyncio
import aiohttp
from dotenv import load_dotenv

load_dotenv()

async def test_groq_model(model_name):
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print("No GROQ_API_KEY found")
        return
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": "Hi"}],
        "max_tokens": 10
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=payload) as response:
                print(f"Model: {model_name} - Status: {response.status}")
                if response.status != 200:
                    print(f"Error: {await response.text()}")
                else:
                    print(f"Success: {await response.json()}")
    except Exception as e:
        print(f"Error testing {model_name}: {e}")

async def main():
    models = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant"
    ]
    for model in models:
        await test_groq_model(model)

if __name__ == "__main__":
    asyncio.run(main())
