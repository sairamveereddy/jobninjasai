import subprocess
import sys
import time

def start_services():
    p1 = subprocess.Popen([sys.executable, "-m", "uvicorn", "job_service:app", "--port", "8001"], cwd=".")
    p2 = subprocess.Popen([sys.executable, "-m", "uvicorn", "server:app", "--port", "8002"], cwd=".")
    p3 = subprocess.Popen([sys.executable, "-m", "uvicorn", "gateway.main:app", "--port", "8000"], cwd=".")
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        p1.terminate()
        p2.terminate()
        p3.terminate()

if __name__ == "__main__":
    start_services()
