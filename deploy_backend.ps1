# AWS ECR Deployment: Nova Ninjas Backend

# 1. Configuration
$AWS_REGION = "us-east-1"
$AWS_ACCOUNT_ID = "146558976928" # Please replace with your AWS Account ID
$ECR_REPO_NAME = "nova-ninjas-backend"
$ECR_REPO_URI = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME"

Write-Host "=== AWS ECR DEPLOYMENT: Nova Ninjas Backend ===" -ForegroundColor Cyan
Write-Host ""

# 2. Authenticate Docker with ECR
Write-Host "1. Authenticating Docker with ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ECR Login failed. Make sure AWS CLI is configured." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 3. Build Docker Image
Write-Host "2. Building Docker Image..." -ForegroundColor Yellow
docker build --platform linux/amd64 -t $ECR_REPO_NAME ./backend

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed." -ForegroundColor Red
    exit $LASTEXITCODE
}

# 4. Tag Docker Image
Write-Host "3. Tagging Docker Image..." -ForegroundColor Yellow
docker tag "$ECR_REPO_NAME:latest" "$ECR_REPO_URI:latest"

# 5. Push Docker Image to ECR
Write-Host "4. Pushing Docker Image to ECR..." -ForegroundColor Yellow
docker push "$ECR_REPO_URI:latest"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "Your image is available at: $ECR_REPO_URI:latest" -ForegroundColor Gray
    Write-Host ""
    Write-Host "NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "1. Go to AWS App Runner console" -ForegroundColor White
    Write-Host "2. Create or Update your service using this ECR image" -ForegroundColor White
}
else {
    Write-Host "❌ Docker push failed." -ForegroundColor Red
}
