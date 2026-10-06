from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from .models import Base
from .database import engine, get_db

# Load .env from backend directory
script_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(script_dir, ".env")
load_dotenv(dotenv_path)

from .api.endpoints import router as api_router

app = FastAPI(title="JobNinjas.ai API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "JobNinjas.ai API is running"}

# Plan Options
@app.post("/api/plans")
async def get_plans():
    return {
        "plans": [
            {"id": "daily", "name": "Daily Ninja", "price": "$15/week", "frequency": "Daily Call"},
            {"id": "alternate", "name": "Alternate Ninja", "price": "$10/week", "frequency": "Every Other Day"},
            {"id": "weekly", "name": "Weekly Ninja", "price": "$5/week", "frequency": "Once a Week"}
        ],
        "first_call_free": True
    }

# Prep Modes
@app.post("/api/prep-modes")
async def select_prep_modes(modes: list):
    return {"selected_modes": modes}

# Other endpoints will be added in routers
