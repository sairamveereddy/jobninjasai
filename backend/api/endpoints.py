from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, UserProfile, Roadmap, CallSchedule, CallResult
from ..services.gemini_service import GeminiService
from ..services.vapi_service import VapiService
from ..services.s3_service import S3Service
import json
import datetime

router = APIRouter()
gemini = GeminiService()
vapi = VapiService()
s3 = S3Service()

@router.post("/user-profile")
async def create_user_profile(
    email: str = Form(...),
    name: str = Form(...),
    current_role: str = Form(...),
    target_role: str = Form(...),
    prep_modes: str = Form(...), # JSON string
    plan_type: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Get or Create User
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, name=name)
        db.add(user)
        db.commit()
        db.refresh(user)

    # 2. Upload Resume to S3
    file_content = await resume.read()
    resume_url = s3.upload_resume(file_content, f"{user.id}_{resume.filename}")
    
    # 3. Extract text (simplified for now, ideally use a parser)
    resume_text = file_content.decode('utf-8', errors='ignore')

    # 4. Save Profile
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        profile = UserProfile(user_id=user.id)
        db.add(profile)
    
    profile.current_role = current_role
    profile.target_role = target_role
    profile.resume_s3_url = resume_url
    profile.resume_text = resume_text
    profile.prep_modes = json.loads(prep_modes)
    profile.plan_type = plan_type
    
    db.commit()
    return {"message": "Profile saved", "user_id": user.id}

@router.post("/generate-roadmap")
async def generate_roadmap(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.profile:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    profile = user.profile
    roadmap_data = await gemini.generate_roadmap(
        profile.current_role,
        profile.target_role,
        profile.resume_text,
        profile.prep_modes,
        profile.plan_type
    )
    
    roadmap = Roadmap(
        user_id=user.id,
        plan_type=profile.plan_type,
        topics_this_week=roadmap_data.get("topics_this_week", []),
        resources=roadmap_data.get("resources", [])
    )
    db.add(roadmap)
    db.commit()
    return roadmap_data

@router.post("/schedule-call")
async def schedule_call(user_id: int, scheduled_at: str, db: Session = Depends(get_db)):
    # scheduled_at should be ISO format
    dt = datetime.datetime.fromisoformat(scheduled_at)
    
    user = db.query(User).filter(User.id == user_id).first()
    schedule = CallSchedule(
        user_id=user_id,
        scheduled_at=dt,
        plan_frequency=user.profile.plan_type
    )
    db.add(schedule)
    db.commit()
    
    # In a real scenario, we'd trigger a background job to start the call at the time
    # For now, let's just return success
    return {"message": "Call scheduled", "schedule_id": schedule.id}

@router.post("/vapi-webhook")
async def vapi_webhook(payload: dict, db: Session = Depends(get_db)):
    # Receive transcript from Vapi
    # payload example: {"call": {"transcript": "..."}, "customer": {"number": "..."}}
    transcript = payload.get("call", {}).get("transcript")
    # Link to user by phone or other ID
    # For now, let's assume we find the latest scheduled call for a user
    # Simplified logic
    results = await gemini.grade_call(transcript, "", "", "") # Needs context
    
    # Save results
    return {"status": "received"}

@router.get("/leaderboard")
async def get_leaderboard(db: Session = Depends(get_db)):
    # Ranked by score or consistency
    results = db.query(User.name, CallResult.score).join(CallResult).order_by(CallResult.score.desc()).limit(10).all()
    return [{"name": r[0], "score": r[1]} for r in results]
