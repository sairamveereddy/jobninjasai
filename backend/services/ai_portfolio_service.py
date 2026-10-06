import os
import json
import logging
from typing import Dict, Any, List
from services.gemini_service import GeminiService
import rds_service

logger = logging.getLogger(__name__)

class AIPortfolioService:
    def __init__(self):
        self.gemini = GeminiService()

    async def get_portfolio_context(self, public_id: str) -> Dict[str, Any]:
        """Fetch all data needed for the AI avatar conversation."""
        portfolio = rds_service.get_ai_portfolio_by_public_id(public_id)
        if not portfolio:
            return None

        user_id = portfolio['user_id']
        verifications = rds_service.get_user_verifications(user_id)
        assessments = rds_service.get_user_skill_assessments(user_id)
        
        # Get full profile for deep history
        profile = rds_service.get_profile(user_id) or {}
        
        # Format verified sections
        verified_certs = [v['data'] for v in verifications if v['type'] == 'certification' and v['status'] == 'verified']
        verified_companies = [v['data'] for v in verifications if v['type'] == 'company_email' and v['status'] == 'verified']
        
        # Format skills
        passed_skills = [a['skill_name'] for a in assessments if a['status'] == 'passed']
        
        return {
            "profile": portfolio,
            "details": {
                "experience": profile.get("experience", []),
                "education": profile.get("education", []),
                "skills": profile.get("skills", [])
            },
            "verifications": {
                "certifications": verified_certs,
                "companies": verified_companies
            },
            "skills": {
                "verified": passed_skills,
                "claimed": profile.get('skills', [])
            },
            "bio": portfolio.get('bio', '')
        }

    def build_system_prompt(self, context: Dict[str, Any]) -> str:
        """Construct the strict RAG-grounded system prompt."""
        profile = context['profile']
        v = context['verifications']
        s = context['skills']
        details = context['details']
        
        cert_list = ", ".join([c.get('name', 'Unknown Cert') for c in v['certifications']]) or "None"
        comp_list = ", ".join([c.get('company', 'Unknown') for c in v['companies']]) or "None"
        skill_list = ", ".join(s['verified']) or "None"

        # Format history
        experience_summary = "\n".join([f"- {e.get('role')} at {e.get('company')} ({e.get('period')}): {e.get('description')}" for e in details['experience']]) or "No experience listed."
        education_summary = "\n".join([f"- {ed.get('degree')} from {ed.get('school')} ({ed.get('year')})" for ed in details['education']]) or "No education listed."

        prompt = f"""
        YOU ARE: The AI Avatar of {profile['name']}, a {profile['current_role']}.
        GOAL: Your job is to talk to Recruiters/HR about {profile['name']}'s background.
        
        STRICT GROUNDING RULES:
        1. ONLY talk about what is in the data below. 
        2. If asked about something not here, say: "I don't have verified information on that yet, but you should definitely ask {profile['name']} in a real interview."
        3. DO NOT HALLUCINATE.
        4. Be professional, premium, and concise. This is a voice interaction.
        
        VERIFIED DATA (TRUSTED):
        - Name: {profile['name']}
        - Current Role: {profile['current_role']}
        - Target Role: {profile['target_role']}
        - Verified Certifications: {cert_list}
        - Verified Past Companies: {comp_list}
        - Verified Skills (Passed Assessments): {skill_list}
        
        CAREER HISTORY:
        {experience_summary}
        
        EDUCATION:
        {education_summary}
        
        UNVERIFIED / CLAIMED DATA (USE WITH CAUTION):
        - Bio: {context['bio']}
        
        VOICE PROTOCOL:
        - Keep responses short (1-3 sentences).
        - Start by welcoming the recruiter. Mention you are {profile['name']}'s AI representative.
        - If they ask "Are you a real person?", explain you are a RAG-grounded AI representation of their verified resume.
        """
        return prompt

    async def check_voice_limit(self, public_id: str, visitor_email: str) -> bool:
        """Check if visitor has exceeded their 30s limit (resets every 2hrs)."""
        portfolio = rds_service.get_ai_portfolio_by_public_id(public_id)
        if not portfolio:
            return False
            
        # Premium portfolios have NO limit
        if portfolio.get('subscription_plan') in ['NINJA_PRO', 'NINJA_ELITE']:
            return True
            
        usage = rds_service.get_voice_usage(portfolio['id'], visitor_email)
        if not usage:
            return True
            
        # Check if 2 hours passed since last reset
        from datetime import datetime, timedelta
        now = datetime.now()
        if usage['last_reset_at'] < now - timedelta(hours=2):
            return True # Will be reset on next update
            
        return usage['seconds_used'] < 30

    async def generate_response(self, public_id: str, history: List[Dict[str, str]], message: str, visitor_email: str = None) -> str:
        """Generate a response using Gemini 1.5 Flash."""
        # Check limits if visitor_email provided
        if visitor_email and not await self.check_voice_limit(public_id, visitor_email):
            return "I've reached my free communication limit for now. Please subscribe to my owner's portfolio for unlimited access, or try again in 2 hours!"

        context = await self.get_portfolio_context(public_id)
        if not context:
            return "Portfolio not found."

        system_prompt = self.build_system_prompt(context)
        
        full_prompt = f"{system_prompt}\n\nConversation History:\n"
        for h in history:
            role = "Recruiter" if h['role'] == 'user' else "AI Avatar"
            full_prompt += f"{role}: {h['content']}\n"
        
        full_prompt += f"Recruiter: {message}\nAI Avatar:"

        # Use gemini service
        response = self.gemini.model.generate_content(full_prompt)
        return response.text
