"""
AI Ninja V2 - AWS RDS Service Layer
Direct PostgreSQL access via psycopg2, no Supabase.
Tables used: users, user_profiles, roadmaps, call_schedules, call_results (from schema.sql)
"""
import os
import json
import logging
import psycopg2
import psycopg2.extras
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

# Load env
_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_dir, ".env"))

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")


def _conn():
    """Get a fresh psycopg2 connection."""
    return psycopg2.connect(DATABASE_URL)


# ─── Users ───────────────────────────────────────────────────────

def get_or_create_user(email: str, name: str = None, phone: str = None) -> Dict[str, Any]:
    """Find existing user by email, or create a new one. Returns the user row as dict."""
    email = email.lower().strip()
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cur.fetchone()
            if user:
                return dict(user)

            cur.execute(
                "INSERT INTO users (email, name, phone) VALUES (%s, %s, %s) RETURNING *",
                (email, name or email.split("@")[0], phone),
            )
            conn.commit()
            return dict(cur.fetchone())


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Find user by email for auth purposes."""
    email = email.lower().strip()
    try:
        with _conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("SELECT * FROM users WHERE email = %s", (email,))
                user = cur.fetchone()
                return dict(user) if user else None
    except Exception as e:
        logger.error(f"Error in get_user_by_email: {e}")
        return None


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """Find user by ID."""
    try:
        with _conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                user = cur.fetchone()
                return dict(user) if user else None
    except Exception as e:
        logger.error(f"Error in get_user_by_id: {e}")
        return None


def create_user(email: str, password_hash: str, name: str = None, phone: str = None, **kwargs) -> Dict[str, Any]:
    """Create a new user with password hash and auth fields."""
    email = email.lower().strip()
    try:
        with _conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    """INSERT INTO users 
                       (email, password_hash, name, phone, role, plan, is_verified, verification_token, referral_code, referred_by) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                       ON CONFLICT (email) DO NOTHING
                       RETURNING *""",
                    (
                        email,
                        password_hash,
                        name or email.split("@")[0],
                        phone,
                        kwargs.get("role", "customer"),
                        kwargs.get("plan", "free"),
                        kwargs.get("is_verified", False),
                        kwargs.get("verification_token"),
                        kwargs.get("referral_code"),
                        kwargs.get("referred_by")
                    ),
                )
                conn.commit()
                row = cur.fetchone()
                if row is None:
                    # ON CONFLICT fired – email already exists
                    raise ValueError(f"Email '{email}' is already registered")
                return dict(row)
    except ValueError:
        raise
    except Exception as e:
        logger.error(f"❌ Error in rds_service.create_user for {email}: {e}")
        return None


def update_user_auth_fields(user_id: int, data: Dict[str, Any]) -> bool:
    """Update auth-related fields in users table."""
    if not data:
        return False
    
    fields = []
    values = []
    for k, v in data.items():
        fields.append(f"{k} = %s")
        values.append(v)
    
    values.append(user_id)
    query = f"UPDATE users SET {', '.join(fields)} WHERE id = %s"
    
    try:
        with _conn() as conn:
            with conn.cursor() as cur:
                cur.execute(query, tuple(values))
                conn.commit()
                return cur.rowcount > 0
    except Exception as e:
        logger.error(f"Error in update_user_auth_fields: {e}")
        return False



# ─── User Profiles (Onboarding) ─────────────────────────────────

def get_profile(user_id: int) -> Optional[Dict[str, Any]]:
    """Get user_profiles row for the given user_id."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM user_profiles WHERE user_id = %s", (user_id,))
            row = cur.fetchone()
            return dict(row) if row else None

def upsert_profile(user_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
    """Create or update user_profiles row for onboarding data."""
    import json
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT id FROM user_profiles WHERE user_id = %s", (user_id,))
            existing = cur.fetchone()

            prep_modes_json = json.dumps(data.get("prep_modes", []))

            if existing:
                cur.execute("""
                    UPDATE user_profiles
                    SET "current_role" = COALESCE(%s, "current_role"),
                        "target_role"  = COALESCE(%s, "target_role"),
                        resume_text  = COALESCE(%s, resume_text),
                        prep_modes   = %s::jsonb,
                        plan_type    = COALESCE(%s, plan_type),
                        location     = COALESCE(%s, location),
                        linkedin_url = COALESCE(%s, linkedin_url),
                        github_url   = COALESCE(%s, github_url),
                        portfolio_url = COALESCE(%s, portfolio_url),
                        profile_photo_url = COALESCE(%s, profile_photo_url),
                        experience   = %s::jsonb,
                        education    = %s::jsonb,
                        skills       = %s::jsonb,
                        full_profile = %s::jsonb,
                        updated_at   = NOW()
                    WHERE user_id = %s
                    RETURNING *
                """, (
                    data.get("current_role"),
                    data.get("target_role"),
                    data.get("resume_text"),
                    prep_modes_json,
                    data.get("plan_type"),
                    data.get("location"),
                    data.get("linkedin_url"),
                    data.get("github_url"),
                    data.get("portfolio_url"),
                    data.get("profile_photo_url"),
                    json.dumps(data.get("experience", [])),
                    json.dumps(data.get("education", [])),
                    json.dumps(data.get("skills", [])),
                    json.dumps(data.get("full_profile", {})),
                    user_id,
                ))
            else:
                cur.execute("""
                    INSERT INTO user_profiles (
                        user_id, "current_role", "target_role", resume_text, prep_modes, plan_type,
                        location, linkedin_url, github_url, portfolio_url, profile_photo_url,
                        experience, education, skills, full_profile
                    )
                    VALUES (%s, %s, %s, %s, %s::jsonb, %s, %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, %s::jsonb, %s::jsonb)
                    RETURNING *
                """, (
                    user_id,
                    data.get("current_role", ""),
                    data.get("target_role", ""),
                    data.get("resume_text", ""),
                    prep_modes_json,
                    data.get("plan_type", "daily"),
                    data.get("location"),
                    data.get("linkedin_url"),
                    data.get("github_url"),
                    data.get("portfolio_url"),
                    data.get("profile_photo_url"),
                    json.dumps(data.get("experience", [])),
                    json.dumps(data.get("education", [])),
                    json.dumps(data.get("skills", [])),
                    json.dumps(data.get("full_profile", {}))
                ))
            conn.commit()
            return dict(cur.fetchone())


def get_profile(user_id: int) -> Optional[Dict[str, Any]]:
    """Get user_profiles row for a user."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM user_profiles WHERE user_id = %s", (user_id,))
            row = cur.fetchone()
            return dict(row) if row else None


# ─── Roadmaps ────────────────────────────────────────────────────

def insert_roadmap(user_id: int, plan_type: str, topics: list, resources: list, sessions: list = None) -> Dict[str, Any]:
    """Insert a new roadmap for the user."""
    import json
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # We try to insert sessions if the column exists, otherwise fallback
            try:
                cur.execute("""
                    INSERT INTO roadmaps (user_id, plan_type, topics_this_week, resources, sessions)
                    VALUES (%s, %s, %s::jsonb, %s::jsonb, %s::jsonb)
                    RETURNING *
                """, (user_id, plan_type, json.dumps(topics), json.dumps(resources), json.dumps(sessions or [])))
            except Exception:
                conn.rollback()
                cur.execute("""
                    INSERT INTO roadmaps (user_id, plan_type, topics_this_week, resources)
                    VALUES (%s, %s, %s::jsonb, %s::jsonb)
                    RETURNING *
                """, (user_id, plan_type, json.dumps(topics), json.dumps(resources)))
            
            conn.commit()
            return dict(cur.fetchone())


def get_latest_roadmap(user_id: int) -> Optional[Dict[str, Any]]:
    """Get the most recent roadmap for a user."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT * FROM roadmaps
                WHERE user_id = %s
                ORDER BY created_at DESC LIMIT 1
            """, (user_id,))
            row = cur.fetchone()
            return dict(row) if row else None


def get_roadmap_by_id(roadmap_id: int) -> Optional[Dict[str, Any]]:
    """Get a specific roadmap by ID."""
    if not roadmap_id:
        return None
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM roadmaps WHERE id = %s", (roadmap_id,))
            row = cur.fetchone()
            return dict(row) if row else None


def _calculate_streak(user_id: int) -> int:
    """Calculate the current consecutive day streak of calls."""
    from datetime import date, timedelta
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT DISTINCT created_at::date
                FROM call_results
                WHERE user_id = %s
                ORDER BY created_at::date DESC
            """, (user_id,))
            dates = [r[0] for r in cur.fetchall()]
            if not dates: return 0
            
            today = date.today()
            yesterday = today - timedelta(days=1)
            
            # If latest call was before yesterday, streak is broken
            if dates[0] < yesterday:
                return 0
                
            streak = 0
            # Start checking from the most recent call date
            check_date = dates[0]
            for d in dates:
                if d == check_date:
                    streak += 1
                    check_date -= timedelta(days=1)
                else:
                    break
            return streak


# ─── Dashboard Stats ─────────────────────────────────────────────

def get_dashboard_stats(user_id: int) -> Dict[str, Any]:
    """Aggregate call stats for the dashboard."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Total calls completed
            cur.execute("SELECT COUNT(*) as total FROM call_results WHERE user_id = %s", (user_id,))
            total_calls = cur.fetchone()["total"]

            # Average score
            cur.execute("SELECT COALESCE(AVG(score), 0) as avg_score FROM call_results WHERE user_id = %s", (user_id,))
            avg_score = round(cur.fetchone()["avg_score"], 1)

            # Latest call
            cur.execute("""
                SELECT score, feedback, created_at FROM call_results
                WHERE user_id = %s ORDER BY created_at DESC LIMIT 1
            """, (user_id,))
            latest = cur.fetchone()

            # Upcoming scheduled calls
            cur.execute("""
                SELECT * FROM call_schedules
                WHERE user_id = %s AND status = 'scheduled' AND scheduled_at > NOW()
                ORDER BY scheduled_at ASC LIMIT 5
            """, (user_id,))
            upcoming = [dict(r) for r in cur.fetchall()]

            # Subscription plan
            cur.execute("""
                SELECT plan_tier, subscription_status, calls_per_period, calls_remaining,
                       billing_period_start, billing_period_end
                FROM ninja_plans WHERE user_id = %s
            """, (user_id,))
            plan_row = cur.fetchone()
            
            subscription = {
                "plan_tier": "free",
                "status": "inactive",
                "calls_per_period": 0,
                "calls_remaining": 0,
                "billing_period_end": None
            }
            
            if plan_row:
                subscription = {
                    "plan_tier": plan_row["plan_tier"] or "free",
                    "status": plan_row["subscription_status"] or "inactive",
                    "calls_per_period": plan_row["calls_per_period"] or 0,
                    "calls_remaining": plan_row["calls_remaining"] or 0,
                    "billing_period_end": plan_row["billing_period_end"].isoformat() if plan_row["billing_period_end"] else None
                }

            return {
                "total_calls": total_calls,
                "sessionsCompleted": total_calls, # Alias for frontend convenience
                "avg_score": avg_score,
                "latest_call": dict(latest) if latest else None,
                "upcoming_calls": upcoming,
                "subscription": subscription,
                "current_streak": _calculate_streak(user_id),
                "rank": _get_user_rank(user_id)
            }

def get_todays_focus(user_id: int) -> Dict[str, Any]:
    """Calculate what the user should focus on today and if a call is scheduled."""
    roadmap = get_latest_roadmap(user_id)
    if not roadmap:
        return {"topics": [], "is_call_day": False}
    
    plan_type = (roadmap.get("plan_type") or "daily").lower()
    sessions = roadmap.get("sessions", [])
    if not sessions:
        return {"topics": [], "is_call_day": False}

    created_at = roadmap.get("created_at")
    if not created_at:
        created_at = datetime.now()
        
    now = datetime.now(created_at.tzinfo) if created_at.tzinfo else datetime.now()
    days_elapsed = (now - created_at).days # 0-indexed day
    
    # Determine current session based on days_elapsed
    # But if it's a call day and NOT verified, we stay on it
    session_idx = days_elapsed % len(sessions)
    if days_elapsed >= len(sessions):
        # We finished the intended duration, stay on the last session (likely the call)
        session_idx = len(sessions) - 1

    current_session = sessions[session_idx]
    session_num = current_session.get("session_number", session_idx + 1)
    topics = current_session.get("focus_points", [])
    is_call_day = current_session.get("is_call_day", False)
    
    # Check if they already called for THIS specific session in this specific roadmap
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT COUNT(*) FROM interviews 
                WHERE user_id = %s AND day_number = %s AND (status = 'completed' OR status = 'verified')
                AND created_at >= %s
            """, (user_id, session_num, created_at))
            called_for_session = cur.fetchone()[0] > 0

    # Fetch verification status for ALL sessions in this roadmap to show on UI
    verification_status = {}
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT day_number, status FROM interviews 
                WHERE user_id = %s AND roadmap_id = %s AND (status = 'completed' OR status = 'verified')
            """, (user_id, roadmap.get("id")))
            for row in cur.fetchall():
                verification_status[row[0]] = True

    # If it's a call day and they already called, mark as verified
    is_verified = called_for_session and is_call_day

    return {
        "topics": topics,
        "is_call_day": is_call_day,
        "is_verified": is_verified,
        "session_number": session_num,
        "session_topic": current_session.get("topic", "Preparation"),
        "plan_type": plan_type,
        "days_elapsed": days_elapsed,
        "called_today": called_for_session,
        "session_description": current_session.get("description", ""),
        "roadmap_id": roadmap.get("id"),
        "verification_status": verification_status
    }

def _get_user_rank(user_id: int) -> int:
    """Get the user's current rank on the global leaderboard."""
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                WITH Leaderboard AS (
                    SELECT u.id, AVG(i.score) as avg_score
                    FROM users u
                    JOIN interviews i ON i.user_id = u.id
                    WHERE i.score IS NOT NULL
                    GROUP BY u.id
                )
                SELECT rank FROM (
                    SELECT id, RANK() OVER (ORDER BY avg_score DESC) as rank
                    FROM Leaderboard
                ) s WHERE id = %s
            """, (user_id,))
            row = cur.fetchone()
            return row[0] if row else 0

def verify_call_session(user_id: int, session_number: int, roadmap_id: int = None) -> bool:
    """Explicitly mark a session as verified or check if it's already verified."""
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT COUNT(*) FROM interviews 
                WHERE user_id = %s AND day_number = %s AND (status = 'completed' OR status = 'verified')
            """, (user_id, session_number))
            return cur.fetchone()[0] > 0

def add_purchased_call(user_id: int, count: int = 1) -> bool:
    """Add a single on-demand call to user's plan ($5 option)."""
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE ninja_plans 
                SET calls_remaining = calls_remaining + %s,
                    updated_at = NOW()
                WHERE user_id = %s
            """, (count, user_id))
            conn.commit()
            return True
            
def decrement_calls_remaining(user_id: int) -> bool:
    """Decrease calls_remaining by 1 when a call is successfully scheduled."""
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE ninja_plans 
                SET calls_remaining = GREATEST(0, calls_remaining - 1),
                    updated_at = NOW()
                WHERE user_id = %s
            """, (user_id,))
            conn.commit()
            return True

def save_call_attempt(user_id: int, vapi_call_id: str, status: str, questions: list = None, day_number: int = 1, phase: str = "Technical", roadmap_id: int = None) -> int:
    """Initialize an entry in the interviews table."""
    import json
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO interviews (user_id, vapi_call_id, status, questions, question_count, day_number, phase, roadmap_id, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
                RETURNING id
                """,
                (user_id, vapi_call_id, status, json.dumps(questions or []), len(questions or []), day_number, phase, roadmap_id),
            )
            interview_id = cur.fetchone()[0]
            conn.commit()
            return interview_id


def update_call_result_on_finish(vapi_call_id: str, transcript: str, summary: str, scores: dict, status: str, recording_url: str = None, duration: int = 0) -> None:
    """Update interviews table when Vapi finishes a call."""
    import json
    with _conn() as conn:
        with conn.cursor() as cur:
            avg_score = 0
            if scores:
                avg_score = int(sum(scores.values()) / len(scores)) if scores else 0
                
            cur.execute(
                """
                UPDATE interviews 
                SET transcript = %s, 
                    feedback = %s, 
                    status = %s, 
                    recording_url = %s, 
                    duration_seconds = %s,
                    score = %s,
                    completed_at = NOW()
                WHERE vapi_call_id = %s
                """,
                (transcript, json.dumps({"summary": summary, "scores": scores}), status, recording_url, duration, avg_score, vapi_call_id),
            )
            conn.commit()


def get_completed_call_count(user_id: int) -> int:
    """Count how many interviews the user has completed."""
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM interviews WHERE user_id = %s AND status = 'completed'", (user_id,))
            return cur.fetchone()[0]


def get_user_id_by_call_id(vapi_call_id: str) -> Optional[int]:
    """Look up user_id associated with a Vapi call ID."""
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT user_id FROM interviews WHERE vapi_call_id = %s", (vapi_call_id,))
            row = cur.fetchone()
            return row[0] if row else None


def increment_user_streak(user_id: int) -> None:
    """Increment user streak in ninja_plans table."""
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE ninja_plans SET current_streak = current_streak + 1, last_completed_day = NOW() WHERE user_id = %s",
                (user_id,),
            )
            conn.commit()


def update_user_subscription(user_id: int, plan_tier: str, status: str, external_id: str) -> None:
    """Update user subscription info in ninja_plans table."""
    # Mapping tiers to call limits
    limits = {
        "starter": 20,
        "pro": 100,
        "unlimited": 9999
    }
    calls_per_period = limits.get(plan_tier.lower(), 20)
    
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO ninja_plans (user_id, plan_tier, subscription_status, calls_per_period, calls_remaining, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
                ON CONFLICT (user_id) DO UPDATE SET
                    plan_tier = EXCLUDED.plan_tier,
                    subscription_status = EXCLUDED.subscription_status,
                    calls_per_period = EXCLUDED.calls_per_period,
                    calls_remaining = EXCLUDED.calls_remaining,
                    updated_at = NOW()
                """,
                (user_id, plan_tier, status, calls_per_period, calls_per_period),
            )
            conn.commit()


def log_payment_event(webhook_id: str, event_type: str, payload: dict, signature_valid: bool, error: str = None) -> None:
    """Log a payment event for idempotency and auditing."""
    import json
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO payment_events (webhook_id, event_type, payload, signature_valid, processing_error, processed_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
                ON CONFLICT (webhook_id) DO NOTHING
                """,
                (webhook_id, event_type, json.dumps(payload), signature_valid, error),
            )
            conn.commit()


def get_ninja_plan(user_id: int) -> Optional[Dict[str, Any]]:
    """Get user's subscription plan from ninja_plans."""
    try:
        with _conn() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute("""
                    SELECT plan_tier, subscription_status, calls_per_period, calls_remaining,
                           billing_period_start, billing_period_end
                    FROM ninja_plans WHERE user_id = %s
                """, (user_id,))
                plan_row = cur.fetchone()
                if not plan_row:
                    return None
                
                return {
                    "plan_tier": plan_row["plan_tier"] or "free",
                    "status": plan_row["subscription_status"] or "inactive",
                    "calls_per_period": plan_row["calls_per_period"] or 0,
                    "calls_remaining": plan_row["calls_remaining"] or 0,
                    "billing_period_end": plan_row["billing_period_end"].isoformat() if plan_row["billing_period_end"] else None
                }
    except Exception as e:
        logger.error(f"Error in get_ninja_plan: {e}")
        return None



# ─── Reports ──────────────────────────────────────────────────────

def _format_report(report: Dict[str, Any]) -> Dict[str, Any]:
    """Helper to parse JSON feedback and format for frontend."""
    if report.get("feedback") and isinstance(report["feedback"], str):
        try:
            fb = json.loads(report["feedback"])
            if isinstance(fb, dict):
                # Ensure fields exist for the PDF generator and UI
                report["scores"] = fb
                if "overall" in fb:
                    report["score"] = fb["overall"]
                if "summary" in fb:
                    report["summary"] = fb["summary"]
                    # If UI expects 'feedback' to be the summary text:
                    report["feedback"] = fb["summary"]
                if "strengths" in fb:
                    report["strengths"] = fb["strengths"]
                if "areas_to_improve" in fb:
                    report["improvements"] = fb["areas_to_improve"]
                    report["areas_to_improve"] = fb["areas_to_improve"]
        except Exception:
            pass
    
    # Ensure some defaults if missing
    if "scores" not in report:
        report["scores"] = {"overall": report.get("score", 0)}
    
    return report

def get_daily_reports(user_id: int) -> List[Dict[str, Any]]:
    """Fetch call results for the last 24 hours."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT 
                    cr.*, 
                    u.name as user_name,
                    up.target_role,
                    up.plan_type as phase
                FROM call_results cr
                JOIN users u ON cr.user_id = u.id
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE cr.user_id = %s AND cr.created_at >= NOW() - INTERVAL '1 day'
                ORDER BY cr.created_at DESC
            """, (user_id,))
            rows = cur.fetchall()
            return [_format_report(dict(r)) for r in rows]

def get_weekly_reports(user_id: int) -> List[Dict[str, Any]]:
    """Fetch call results for the last 7 days."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT 
                    cr.*, 
                    u.name as user_name,
                    up.target_role,
                    up.plan_type as phase
                FROM call_results cr
                JOIN users u ON cr.user_id = u.id
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE cr.user_id = %s AND cr.created_at >= NOW() - INTERVAL '7 days'
                ORDER BY cr.created_at DESC
            """, (user_id,))
            rows = cur.fetchall()
            return [_format_report(dict(r)) for r in rows]

def get_monthly_reports(user_id: int) -> List[Dict[str, Any]]:
    """Fetch call results for the last 30 days."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT 
                    cr.*, 
                    u.name as user_name,
                    up.target_role,
                    up.plan_type as phase
                FROM call_results cr
                JOIN users u ON cr.user_id = u.id
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE cr.user_id = %s AND cr.created_at >= NOW() - INTERVAL '30 days'
                ORDER BY cr.created_at DESC
            """, (user_id,))
            rows = cur.fetchall()
            return [_format_report(dict(r)) for r in rows]

def get_streak_data(user_id: int) -> Dict[str, Any]:
    """Fetch streak info and recent activity for the streak calendar."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Current streak (approximate by counting consecutive days with at least one call)
            # This is a bit complex for SQL, let's just return daily activity for now
            cur.execute("""
                SELECT 
                    DATE(created_at) as date, 
                    MAX(score) as score 
                FROM call_results 
                WHERE user_id = %s AND created_at >= NOW() - INTERVAL '90 days'
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            """, (user_id,))
            activity = [dict(r) for r in cur.fetchall()]
            
            # Simple streak calculation
            streak = 0
            if activity:
                # If they were active today or yesterday
                from datetime import date
                today = date.today()
                last_active = activity[0]["date"]
                if (today - last_active).days <= 1:
                    streak = 1
                    # Check backwards
                    # (In a real app, you'd iterate through dates)
            
            return {
                "currentStreak": streak, # Placeholder
                "longestStreak": streak, # Placeholder
                "activity": activity
            }

# ─── Leaderboard ──────────────────────────────────────────────────

def get_leaderboard(limit: int = 20) -> List[Dict[str, Any]]:
    """Get top users ranked by average call score."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT
                    u.id, u.name, u.email,
                    COUNT(cr.id) as total_calls,
                    COALESCE(ROUND(AVG(cr.score)::numeric, 1), 0) as avg_score,
                    RANK() OVER (ORDER BY AVG(cr.score) DESC) as rank
                FROM users u
                LEFT JOIN call_results cr ON cr.user_id = u.id
                GROUP BY u.id, u.name, u.email
                HAVING COUNT(cr.id) > 0
                ORDER BY avg_score DESC, total_calls DESC
                LIMIT %s
            """, (limit,))
            return [dict(r) for r in cur.fetchall()]
# ─── AI Portfolio ──────────────────────────────────────────────────

def get_ai_portfolio(user_id: int) -> Optional[Dict[str, Any]]:
    """Get the AI portfolio for a user."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM ai_portfolios WHERE user_id = %s", (user_id,))
            row = cur.fetchone()
            return dict(row) if row else None

def get_ai_portfolio_by_public_id(public_id: str) -> Optional[Dict[str, Any]]:
    """Get the AI portfolio by its public slug/ID."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT p.*, u.name, u.email, u.plan as user_plan, up.current_role, up.target_role, up.location, 
                       up.linkedin_url, up.github_url, up.portfolio_url, up.profile_photo_url,
                       up.experience, up.education, up.skills as profile_skills
                FROM ai_portfolios p
                JOIN users u ON p.user_id = u.id
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE (p.public_id = %s OR p.custom_username = %s) AND p.is_published = TRUE
            """, (public_id, public_id))
            row = cur.fetchone()
            return dict(row) if row else None

def get_ai_portfolio_by_public_id_any_status(public_id: str) -> Optional[Dict[str, Any]]:
    """Get portfolio by ID or username regardless of published status."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT p.*, u.name, u.email, u.plan as user_plan, up.current_role, up.target_role, up.location, 
                       up.linkedin_url, up.github_url, up.portfolio_url, up.profile_photo_url,
                       up.experience, up.education, up.skills as profile_skills
                FROM ai_portfolios p
                JOIN users u ON p.user_id = u.id
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE (p.public_id = %s OR p.custom_username = %s)
            """, (public_id, public_id))
            row = cur.fetchone()
            return dict(row) if row else None

def get_ai_portfolio_by_username(username: str) -> Optional[Dict[str, Any]]:
    """Get portfolio by custom username (e.g. sairam)."""
    return get_ai_portfolio_by_public_id(username)

def upsert_ai_portfolio(user_id: int, data: Dict[str, Any]) -> Dict[str, Any]:
    """Create or update an AI portfolio with v2 metadata."""
    import json
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO ai_portfolios (
                    user_id, public_id, custom_username, voice_choice, bio, 
                    projects, interests, social_links, is_published, subscription_plan
                )
                VALUES (%s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, %s::jsonb, %s, %s)
                ON CONFLICT (user_id) DO UPDATE SET
                    public_id = COALESCE(EXCLUDED.public_id, ai_portfolios.public_id),
                    custom_username = EXCLUDED.custom_username,
                    voice_choice = EXCLUDED.voice_choice,
                    bio = EXCLUDED.bio,
                    projects = EXCLUDED.projects,
                    interests = EXCLUDED.interests,
                    social_links = EXCLUDED.social_links,
                    is_published = EXCLUDED.is_published,
                    subscription_plan = EXCLUDED.subscription_plan,
                    updated_at = NOW()
                RETURNING *
            """, (
                user_id,
                data.get("public_id"),
                data.get("custom_username"),
                data.get("voice_choice", "female"),
                data.get("bio", ""),
                json.dumps(data.get("projects", [])),
                json.dumps(data.get("interests", [])),
                json.dumps(data.get("social_links", {})),
                data.get("is_published", False),
                data.get("subscription_plan", "free")
            ))
            conn.commit()
            return dict(cur.fetchone())

def add_verification(user_id: int, v_type: str, status: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Add a verification record (cert, company email, etc)."""
    import json
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO verifications (user_id, type, status, data, verified_at)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING *
            """, (
                user_id, v_type, status, json.dumps(data),
                datetime.now(timezone.utc) if status == "verified" else None
            ))
            conn.commit()
            return dict(cur.fetchone())

def get_user_verifications(user_id: int) -> List[Dict[str, Any]]:
    """Get all verifications for a user."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM verifications WHERE user_id = %s ORDER BY created_at DESC", (user_id,))
            return [dict(r) for r in cur.fetchall()]

def update_verification_status(verification_id: int, status: str) -> bool:
    """Update the status of a verification record."""
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE verifications 
                SET status = %s, verified_at = %s 
                WHERE id = %s
            """, (
                status, 
                datetime.now(timezone.utc) if status == "verified" else None,
                verification_id
            ))
            conn.commit()
            return cur.rowcount > 0

def upsert_skill_assessment(user_id: int, skill_name: str, status: str, score: int, quiz_data: Dict[str, Any]) -> Dict[str, Any]:
    """Add or update a skill assessment result."""
    import json
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO skill_assessments (user_id, skill_name, status, score, quiz_data)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (user_id, skill_name) DO UPDATE SET
                    status = EXCLUDED.status,
                    score = EXCLUDED.score,
                    quiz_data = EXCLUDED.quiz_data,
                    updated_at = NOW()
                RETURNING *
            """, (user_id, skill_name, status, score, json.dumps(quiz_data)))
            conn.commit()
            return dict(cur.fetchone())

def mark_skill_verified(user_id: int, skill_name: str, is_verified: bool = True):
    """Mark a specific skill as verified for a user."""
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE skill_assessments 
                SET is_verified = %s, updated_at = NOW() 
                WHERE user_id = %s AND skill_name ILIKE %s
            """, (is_verified, user_id, skill_name))
            conn.commit()

def get_user_skill_assessments(user_id: int) -> List[Dict[str, Any]]:
    """Get all skill assessments for a user."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM skill_assessments WHERE user_id = %s ORDER BY updated_at DESC", (user_id,))
            return [dict(r) for r in cur.fetchall()]

def log_visitor(portfolio_id: int, visitor_email: str, visitor_company: str, summary: str = None, duration: int = 0) -> Dict[str, Any]:
    """Log a visitor session on a portfolio."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO visitor_logs (portfolio_id, visitor_email, visitor_company, summary, duration_seconds)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING *
            """, (portfolio_id, visitor_email, visitor_company, summary, duration))
            conn.commit()
            return dict(cur.fetchone())

def get_visitor_logs(portfolio_id: int) -> List[Dict[str, Any]]:
    """Get visitor logs for a specific portfolio."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM visitor_logs WHERE portfolio_id = %s ORDER BY created_at DESC", (portfolio_id,))
            return [dict(r) for r in cur.fetchall()]

def get_verified_portfolios(search_query: str = None, min_verified_skills: int = 0, limit: int = 20, offset: int = 0) -> List[Dict[str, Any]]:
    """Search for verified portfolios for the recruiter portal."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            sql = """
                SELECT p.*, u.name, up.current_role, up.location, up.profile_photo_url,
                       (SELECT COUNT(*) FROM skill_assessments sa WHERE sa.user_id = u.id AND sa.is_verified = TRUE) as verified_skills_count
                FROM ai_portfolios p
                JOIN users u ON p.user_id = u.id
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE p.is_published = TRUE AND u.plan != 'free'
            """
            params = []
            if search_query:
                sql += " AND (u.name ILIKE %s OR up.current_role ILIKE %s OR up.skills::text ILIKE %s)"
                q = f"%{search_query}%"
                params.extend([q, q, q])
            
            if min_verified_skills > 0:
                # We need to wrap the query or use HAVING if we use GROUP BY, but here we can just use the subquery in WHERE if we want, or wrap it.
                # Easier to wrap the whole thing.
                sql = f"SELECT * FROM ({sql}) as results WHERE verified_skills_count >= %s"
                params.append(min_verified_skills)

            sql += " ORDER BY verified_skills_count DESC, updated_at DESC LIMIT %s OFFSET %s"
            params.extend([limit, offset])
            
            cur.execute(sql, tuple(params))
            return [dict(r) for r in cur.fetchall()]

def update_voice_session_timestamp(user_id: int) -> bool:
    """Update last_voice_session for rate limiting."""
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE ai_portfolios SET last_voice_session = NOW() WHERE user_id = %s", (user_id,))
            conn.commit()
            return cur.rowcount > 0

def get_voice_usage(portfolio_id: int, visitor_email: str) -> Optional[Dict[str, Any]]:
    """Get usage stats for a specific visitor on a portfolio."""
    with _conn() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT * FROM portfolio_usage 
                WHERE portfolio_id = %s AND visitor_email = %s
            """, (portfolio_id, visitor_email))
            return cur.fetchone()

def update_voice_usage(portfolio_id: int, visitor_email: str, seconds: int):
    """Increment usage seconds and reset if 2 hours passed."""
    from datetime import datetime, timedelta
    now = datetime.now()
    two_hours_ago = now - timedelta(hours=2)
    
    with _conn() as conn:
        with conn.cursor() as cur:
            # Check if we need to reset
            cur.execute("""
                SELECT last_reset_at FROM portfolio_usage 
                WHERE portfolio_id = %s AND visitor_email = %s
            """, (portfolio_id, visitor_email))
            row = cur.fetchone()
            
            if row and row[0] < two_hours_ago:
                # Reset
                cur.execute("""
                    UPDATE portfolio_usage 
                    SET seconds_used = %s, last_reset_at = %s
                    WHERE portfolio_id = %s AND visitor_email = %s
                """, (seconds, now, portfolio_id, visitor_email))
            elif row:
                # Increment
                cur.execute("""
                    UPDATE portfolio_usage 
                    SET seconds_used = seconds_used + %s
                    WHERE portfolio_id = %s AND visitor_email = %s
                """, (seconds, portfolio_id, visitor_email))
            else:
                # Insert
                cur.execute("""
                    INSERT INTO portfolio_usage (portfolio_id, visitor_email, seconds_used, last_reset_at)
                    VALUES (%s, %s, %s, %s)
                """, (portfolio_id, visitor_email, seconds, now))
            conn.commit()
