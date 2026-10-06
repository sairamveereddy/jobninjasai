import os
import sys
import json

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

# Mock env
os.environ["USE_RDS_DATABASE"] = "True"
os.environ["DATABASE_URL"] = "postgresql://mock:mock@localhost:5432/mock" # Doesn't matter for logic check

try:
    from server import flatten_profile_data
    
    mock_nested_data = {
        "identity": {
            "firstName": "Ninja",
            "lastName": "Trainee",
            "title": "AI Master"
        },
        "socials": {
            "linkedin": "https://linkedin.com/in/ninja"
        },
        "experience": [{"company": "Dojo", "title": "Student"}],
        "education": [],
        "skills": ["Stealth", "Python"]
    }
    
    flattened = flatten_profile_data(mock_nested_data)
    print("--- Flattened Data ---")
    print(json.dumps(flattened, indent=2))
    
    expected_keys = ["full_profile", "full_name", "target_role", "linkedin_url", "experience", "education", "skills"]
    for key in expected_keys:
        if key in flattened:
            print(f"✅ Found key: {key}")
        else:
            print(f"❌ Missing key: {key}")

    if flattened["full_name"] == "Ninja Trainee":
        print("✅ Name correctly flattened")
    if flattened["target_role"] == "AI Master":
        print("✅ Title correctly flattened")
    if isinstance(flattened["full_profile"], dict):
        print("✅ Full profile preserved as JSONB")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
