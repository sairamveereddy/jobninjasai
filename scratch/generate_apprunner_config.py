import os
from dotenv import load_dotenv
import json

# Load env variables from backend/.env
load_dotenv('backend/.env')

# Service Name
SERVICE_NAME = "jobninjas-api"

# ECR Image
IMAGE_REPO = "146558976928.dkr.ecr.us-east-1.amazonaws.com/jobninjas-backend"

# ECR Access Role
ACCESS_ROLE_ARN = "arn:aws:iam::146558976928:role/service-role/AppRunnerECRAccessRole"

# App Runner Environment Variables (as a map)
env_vars = {}
# Explicitly include the important ones
keys = [
    "DATABASE_URL", "AWS_S3_BUCKET", "COGNITO_USER_POOL_ID", 
    "COGNITO_APP_CLIENT_ID", "COGNITO_APP_CLIENT_SECRET", "AWS_REGION",
    "USE_RDS_DATABASE", "USE_COGNITO_AUTH", "USE_S3_STORAGE",
    "MONGO_URL", "DB_NAME", "RESEND_API_KEY", "FROM_EMAIL", 
    "ADMIN_EMAIL", "GROQ_API_KEY", "RAPIDAPI_KEY", "USAJOBS_API_KEY",
    "ADZUNA_APP_ID", "ADZUNA_APP_KEY", "BYOK_MASTER_KEY"
]

for key in keys:
    val = os.environ.get(key)
    if val:
        env_vars[key] = val

# Add PORT as well
env_vars["PORT"] = "8000"

# Construct the CLI command
cmd = {
    "ServiceName": SERVICE_NAME,
    "SourceConfiguration": {
        "AuthenticationConfiguration": {
            "AccessRoleArn": ACCESS_ROLE_ARN
        },
        "ImageRepository": {
            "ImageIdentifier": f"{IMAGE_REPO}:latest",
            "ImageConfiguration": {
                "Port": "8000",
                "RuntimeEnvironmentVariables": env_vars
            },
            "ImageRepositoryType": "ECR"
        },
        "AutoDeploymentsEnabled": True
    },
    "InstanceConfiguration": {
        "Cpu": "1 vCPU",
        "Memory": "2 GB"
    }
}

with open('app_runner_config.json', 'w') as f:
    json.dump(cmd, f, indent=2)

print("Generated app_runner_config.json")
