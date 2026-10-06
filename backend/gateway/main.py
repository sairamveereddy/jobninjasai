from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("gateway")

app = FastAPI(title="JobNinjas API Gateway")

# Add CORS middleware to handled preflight locally if needed, 
# but we also forward OPTIONS to the monolith which has its own CORS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

JOB_SERVICE_URL = os.getenv("JOB_SERVICE_URL", "http://127.0.0.1:8001")
MONOLITH_URL = os.getenv("MONOLITH_URL", "http://127.0.0.1:8002")

# Create a shared HTTPX client
client = httpx.AsyncClient()

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def gateway(request: Request, path: str):
    # Route selection logic
    # Re-aligned: Route /api/jobs and /jobs to monolith (8002) until Job Service (8001) is fully extracted.
    # We use a special prefix if we want to target the microservice explicitly.
    if path.startswith("api/jobs/micro") or path.startswith("jobs/micro"):
        target_url = f"{JOB_SERVICE_URL}/{path}"
    else:
        # Default to Monolith for everything else, including standard /api/jobs
        target_url = f"{MONOLITH_URL}/{path}"
    
    # DEBUG PRINT
    print(f"GATEWAY DEBUG: Routing to {target_url}")
    logger.info(f"Gateway: Routing {request.method} /{path} -> {target_url}")

    # For OPTIONS requests, we can either return a 200 OK immediately 
    # (since we have CORSMiddleware) or forward it. Forwarding is safer 
    # to ensure consistency with backend CORS policies.
    if request.method == "OPTIONS":
        return Response(status_code=200)

    # Prepare forwarding request
    body = await request.body()
    headers = dict(request.headers)
    
    # Remove hop-by-hop headers and host to avoid issues
    headers.pop("host", None)
    headers.pop("content-length", None)
    
    try:
        response = await client.request(
            method=request.method,
            url=target_url,
            params=request.query_params,
            headers=headers,
            content=body,
            timeout=60.0
        )
        
        # Return the response from the target service
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )
    except Exception as e:
        logger.error(f"Gateway Forwarding Error: {str(e)}")
        return Response(
            content=f"Gateway Error: {str(e)}", 
            status_code=502
        )

@app.on_event("shutdown")
async def shutdown_event():
    await client.aclose()

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("GATEWAY_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
