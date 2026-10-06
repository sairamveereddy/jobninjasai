import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

# Load .env from backend directory
script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(script_dir, ".env")
load_dotenv(dotenv_path)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class GeminiService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        
    def _fallback_chat(self, prompt):
        from interview_service import AIService
        return AIService.chat(prompt, json_mode=True)

    async def generate_roadmap(self, current_role, target_role, resume_text, prep_modes, plan_type):
        """
        Generates a roadmap structured by sessions based on the frequency (plan_type).
        plan_type options: 'weekly', 'alternate', 'daily'
        """
        
        frequency_desc = {
            "weekly": "1 session per week (Day 1-5: Deep Study of specific focus points, Day 6: Tactical Practice Call)",
            "alternate": "1 call every 2 days (Day 1: Study Session, Day 2: Integrated Practice Call)",
            "daily": "1 call every day (Intensive 24/7 Training Protocol)"
        }.get(plan_type.lower(), "1 call every day")

        prompt = f"""
        You are the Head Coach at JobNinjas. Generate an elite 4-week tactical roadmap for a candidate transitioning from {current_role} to {target_role}.
        
        Candidate Context:
        - Resume Footprint: {resume_text[:2000]}
        - Training Modes: {', '.join(prep_modes)}
        - Cadence Strategy: {frequency_desc} ({plan_type})

        PROTOCOL REQUIREMENTS:
        - If 'weekly': Provide 6 Sessions (Day 1-6). Day 1 to Day 5 are study sessions ("is_call_day": false). Day 6 MUST be the call day ("is_call_day": true).
        - If 'alternate': Provide 6 Sessions (Day 1-6). Every 2nd session (Day 2, 4, 6) MUST have "is_call_day": true.
        - If 'daily': Provide 7 Sessions (Day 1-7). EVERY session MUST have "is_call_day": true.
        - CRITICAL: EVERY session MUST have "is_locked": false. All content must be fully accessible from the start.

        Output must be a valid JSON object:
        {{
          "sessions": [
            {{
              "session_number": 1,
              "day": 1,
              "topic": "Mission Title",
              "focus_points": ["Topic 1", "Topic 2", ...],
              "description": "Short tactical briefing for this session.",
              "difficulty": "Medium/Advanced",
              "estimated_minutes": 120,
              "is_call_day": true/false,
              "is_locked": false
            }}
          ],
          "resources": [
            {{ "title": "Resource Name", "url": "https://..." }}
          ]
        }}

        Ensure the roadmap builds cumulative expertise and addresses the {target_role} expectations perfectly.
        """
        
        try:
            response = self.model.generate_content(prompt)
            content = response.text
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            data = json.loads(content)
        except Exception as e:
            print(f"Gemini failed, falling back to Groq: {e}")
            try:
                content = self._fallback_chat(prompt)
                data = json.loads(content)
            except Exception as inner_e:
                print(f"Fallback failed: {inner_e}")
                data = {
                    "sessions": [{"session_number": 1, "week": 1, "topic": "Interview Fundamentals", "focus_points": ["Behavioral basics", "Introduction"]}],
                    "topics_this_week": ["Review fundamentals"], 
                    "resources": []
                }
        
        # Ensure sessions exists
        if "sessions" not in data or not data["sessions"]:
             data["sessions"] = [{"session_number": 1, "week": 1, "topic": "Interview Fundamentals", "focus_points": ["System architecture", "Behavioral patterns"]}]

        # Flatten topics for legacy compatibility
        data["topics_this_week"] = [s["topic"] for s in data["sessions"][:5]]
        return data

    async def extract_skills(self, resume_text):
        prompt = f"""
        Extract the top skills from the following resume text.
        Resume: {resume_text}

        Return a JSON object with:
        1. "topSkills": List of up to 10 technical or hard skills.
        2. "softSkills": List of up to 5 soft skills.
        """
        
        try:
            response = self.model.generate_content(prompt)
            content = response.text
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            return json.loads(content)
        except Exception as e:
            print(f"Gemini failed for skills, falling back: {e}")
            try:
                content = self._fallback_chat(prompt)
                return json.loads(content)
            except:
                return {"topSkills": [], "softSkills": []}

    async def grade_call(self, transcript, resume_text, current_role, target_role):
        prompt = f"""
        Grade this interview transcript:
        Transcript: {transcript}
        User Context: {resume_text}
        Moving from {current_role} to {target_role}.

        Return a JSON object with:
        1. "score": Integer (0-100)
        2. "feedback": String with constructive feedback.
        """
        
        try:
            response = self.model.generate_content(prompt)
            content = response.text
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            return json.loads(content)
        except Exception as e:
            print(f"Gemini failed for grading, falling back: {e}")
            try:
                content = self._fallback_chat(prompt)
                return json.loads(content)
            except:
                return {"score": 0, "feedback": "Evaluation failed."}
