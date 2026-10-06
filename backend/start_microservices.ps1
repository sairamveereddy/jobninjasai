# start_microservices.ps1
# Script to start all microservices locally on Windows

Write-Host "Starting Nova Ninjas Microservices..." -ForegroundColor Green

# Load .env to get ports if they exist
if (Test-Path ".env") {
    foreach ($line in Get-Content .env) {
        if ($line -match "^([^#=]+)=(.+)$") {
            $name = $Matches[1].Trim()
            $value = $Matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

$GATEWAY_PORT = if ($env:GATEWAY_PORT) { $env:GATEWAY_PORT } else { 8000 }
$JOB_PORT = if ($env:JOB_SERVICE_PORT) { $env:JOB_SERVICE_PORT } else { 8001 }
$MONO_PORT = if ($env:MONOLITH_PORT) { $env:MONOLITH_PORT } else { 8002 }

# 1. Start the Job Service
Write-Host "Starting Job Service on port $JOB_PORT..."
Start-Process -NoNewWindow -FilePath "py" -ArgumentList "-m uvicorn job_service.main:app --port $JOB_PORT --reload"

# 2. Start the Monolith / Core Service
Write-Host "Starting Monolith on port $MONO_PORT..."
Start-Process -NoNewWindow -FilePath "py" -ArgumentList "-m uvicorn server:app --port $MONO_PORT --reload"

# 3. Start the API Gateway
Write-Host "Starting Gateway on port $GATEWAY_PORT..."
Start-Process -NoNewWindow -FilePath "py" -ArgumentList "-m uvicorn gateway.main:app --port $GATEWAY_PORT --reload"

Write-Host "All services started!" -ForegroundColor Green
Write-Host "Gateway: http://localhost:$GATEWAY_PORT"
Write-Host "Job Service: http://localhost:$JOB_PORT"
Write-Host "Monolith: http://localhost:$MONO_PORT"
