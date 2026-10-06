# start_all.ps1
$ROOT = Get-Location
$PYTHON = "$ROOT\.venv\Scripts\python.exe"
$UVICORN = "$ROOT\.venv\Scripts\uvicorn.exe"

Write-Host "Starting Backend Services..." -ForegroundColor Green

# 1. Start Job Service
Write-Host "Starting Job Service on port 8001..."
Start-Process -NoNewWindow -FilePath $PYTHON -ArgumentList "-m uvicorn job_service.main:app --port 8001 --host 0.0.0.0" -WorkingDirectory "$ROOT\backend"

# 2. Start Monolith
Write-Host "Starting Monolith on port 8002..."
Start-Process -NoNewWindow -FilePath $PYTHON -ArgumentList "-m uvicorn server:app --port 8002 --host 0.0.0.0" -WorkingDirectory "$ROOT\backend"

# 3. Start Gateway
Write-Host "Starting Gateway on port 8000..."
Start-Process -NoNewWindow -FilePath $PYTHON -ArgumentList "-m uvicorn gateway.main:app --port 8000 --host 0.0.0.0" -WorkingDirectory "$ROOT\backend"

Write-Host "Starting Frontend..." -ForegroundColor Green
# 4. Start Frontend
Start-Process -NoNewWindow -FilePath "npm.cmd" -ArgumentList "start" -WorkingDirectory "$ROOT\frontend"

Write-Host "Services are starting up. Waiting 10 seconds..."
Start-Sleep -s 10

Write-Host "Done!" -ForegroundColor Green
