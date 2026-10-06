from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router

app = FastAPI(
    title="Job Ninjas AI Workflow Service",
    description="Mock AI and workflow execution backend for Job Ninjas prototype",
    version="0.1.0"
)

# CORS configuration for prototype
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router.api_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
