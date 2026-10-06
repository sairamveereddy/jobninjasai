import logging
import rds_service
import time
from ninja.questions import generate_interview_questions
from ninja.vapi_client import VapiClient
from typing import Dict, Any

logger = logging.getLogger(__name__)

async def launch_call(email: str, dry_run: bool = False, day_number: int = None, roadmap_id: int = None) -> Dict[str, Any]:
    """
    Main entry point for triggering a practice call.
    1. Fetches user profile and roadmap.
    2. Determines the current session based on progress (or explicit day_number).
    3. Generates dynamic questions via OpenAI for that session.
    4. Triggers Vapi outbound call (unless dry_run).
    5. Logs the attempt in RDS.
    """
    try:
        # 1. Resolve user and profile
        user = rds_service.get_or_create_user(email=email)
        profile = rds_service.get_profile(user["id"])
        plan = rds_service.get_ninja_plan(user["id"])
        
        if not user.get("phone"):
            return {"success": False, "error": "Phone number not found. Please add your phone number in Profile settings."}

        if (plan.get("calls_remaining") or 0) <= 0:
            return {"success": False, "error": "No calls remaining in your plan. Please purchase a single call or upgrade."}

        if not profile or not profile.get("target_role"):
            return {"success": False, "error": "Target role not set. Please complete your profile first."}

        if not roadmap_id:
            roadmap = rds_service.get_latest_roadmap(user["id"])
            if not roadmap:
                return {"success": False, "error": "No active roadmap found. Please generate a roadmap first."}
            roadmap_id = roadmap["id"]
        else:
            roadmap = rds_service.get_roadmap_by_id(roadmap_id)
            if not roadmap:
                return {"success": False, "error": f"Roadmap session not found."}

        # 2. Determine current session
        completed_count = rds_service.get_completed_call_count(user["id"])
        sessions = roadmap.get("sessions", [])
        
        # Default topics if sessions are missing (legacy support)
        if not sessions:
            topics = roadmap.get("topics_this_week", ["General Interviewing"])
            session_topic = topics[0]
            session_focus = topics
            session_num = day_number or (completed_count + 1)
        else:
            if day_number:
                # Find the session with this day_number
                current_session = next((s for s in sessions if s.get("session_number") == day_number), None)
                if not current_session:
                    # Fallback to session index if number not found
                    session_idx = (day_number - 1) % len(sessions)
                    current_session = sessions[session_idx]
            else:
                # Pick the next session in the list based on history
                session_idx = completed_count % len(sessions)
                current_session = sessions[session_idx]
            
            session_topic = current_session.get("topic", "General Interviewing")
            session_focus = current_session.get("focus_points", [session_topic])
            session_num = current_session.get("session_number", day_number or (completed_count + 1))

        # 3. Generate custom questions for THIS session
        if completed_count == 0:
            # Special Onboarding/Welcome Call
            system_prompt = f"""
            You are Nova, the lead AI Career Ninja at JobNinjas. This is the candidate's FIRST orientation call.
            
            YOUR GOALS:
            1. Warmly welcome the candidate to the JobNinjas Elite Protocol.
            2. Explain that we've analyzed their resume and target role: {profile["target_role"]}.
            3. Briefly mention the generated roadmap and how their specific plan ({profile.get("plan_type", "daily")}) will work.
            4. Ask 2-3 high-level diagnostic questions to understand their immediate career concerns.
            5. Set expectations: 'I will be calling you according to your plan to keep you sharp.'
            
            Candidate Context:
            - Target Role: {profile["target_role"]}
            - Resume: {profile.get("resume_text", "")[:500]}...
            
            Keep the tone professional, encouraging, and high-energy.
            """
        else:
            system_prompt = await generate_interview_questions(
                target_role=profile["target_role"],
                resume_text=profile.get("resume_text", ""),
                topics=session_focus
            )

        if dry_run:
            interview_id = rds_service.save_call_attempt(
                user_id=user["id"],
                vapi_call_id=f"dry_run_{user['id']}_{int(time.time())}",
                status="dry_run",
                questions=[system_prompt],
                day_number=session_num,
                roadmap_id=roadmap_id
            )
            return {
                "success": True,
                "message": f"Dry run successful for session {session_num}: {session_topic}",
                "interview_id": interview_id,
                "session_topic": session_topic,
                "system_prompt_preview": system_prompt[:200] + "..."
            }

        # 4. Trigger Vapi
        vapi = VapiClient()
        vapi_resp = await vapi.trigger_call(
            phone_number=user.get("phone", ""),
            name=user.get("name", "Candidate"),
            system_prompt=system_prompt,
            user_id=user["id"]
        )

        # 5. Save result
        vapi_call_id = vapi_resp.get("id")
        status = "scheduled" if vapi_call_id else "failed"
        
        interview_id = rds_service.save_call_attempt(
            user_id=user["id"],
            vapi_call_id=vapi_call_id,
            status=status,
            questions=[system_prompt],
            day_number=session_num,
            roadmap_id=roadmap_id
        )

        if status == "failed":
            return {"success": False, "error": vapi_resp.get("error", "Unknown Vapi error")}

        # 6. Decrement call allowance
        rds_service.decrement_calls_remaining(user["id"])

        return {
            "success": True,
            "message": f"Session {session_num} ({session_topic}) initiated successfully",
            "vapi_call_id": vapi_call_id,
            "interview_id": interview_id
        }

    except Exception as e:
        logger.error(f"launch_call failed for {email}: {e}")
        return {"success": False, "error": str(e)}
