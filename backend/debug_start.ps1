# debug_start.ps1
Write-Host "Starting services with logging..."
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m uvicorn job_service.main:app --port 8001" -RedirectStandardOutput "job_service.log" -RedirectStandardError "job_service_err.log"
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m uvicorn server:app --port 8002" -RedirectStandardOutput "server.log" -RedirectStandardError "server_err.log"
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m uvicorn gateway.main:app --port 8000" -RedirectStandardOutput "gateway.log" -RedirectStandardError "gateway_err.log"
Write-Host "Done."
