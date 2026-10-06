import os
import json
import logging
import httpx
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

async def generate_interview_questions(
    target_role: str,
    resume_text: str,
    topics: List[str],
    num_questions: int = 5
) -> str:
    """
    Generate a structured prompt for Vapi/OpenAI to follow during the interview.
    Returns a string containing the instructions and the specific questions.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY not found in environment")
        return "You are an interviewer. Ask 5 behavioral questions about job experience."

    prompt = f"""
    You are an expert technical recruiter interviewing a candidate for a {target_role} position.
    
    Candidate Resume Summary:
    {resume_text[:2000]}
    
    This week's focus topics from their roadmap:
    {", ".join(topics)}
    
    TASK:
    Generate {num_questions} high-quality interview questions. 
    - 2 behavioral questions based on their resume.
    - 3 technical questions based on the focus topics: {", ".join(topics)}.
    
    Format the output as a JSON object with a 'questions' key containing a list of strings.
    """

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": "gpt-4o",
                    "messages": [{"role": "user", "content": prompt}],
                    "response_format": {"type": "json_object"}
                },
                timeout=30.0
            )
            resp.raise_for_status()
            data = resp.json()
            content = data["choices"][0]["message"]["content"]
            questions_list = json.loads(content).get("questions", [])
            
            # Combine into a single system instruction for Vapi
            formatted_questions = "\n".join([f"{i+1}. {q}" for i, q in enumerate(questions_list)])
            
            return f"""
            You are a professional interviewer for a {target_role} role. 
            Your goal is to conduct a 10-15 minute practice interview.
            
            Here are the questions you must cover:
            {formatted_questions}
            
            INSTRUCTIONS:
            1. Start by introducing yourself and stating this is a practice session for the {target_role} role.
            2. Ask the questions one by one. Wait for the candidate's full response before moving to the next.
            3. Provide brief, encouraging feedback after each answer if appropriate, but keep the focus on the questions.
            4. If the candidate is stuck, provide a small hint.
            5. At the end, thank them and tell them the session is complete.
            """
    except Exception as e:
        logger.error(f"Error generating questions: {e}")
        return f"You are an interviewer for a {target_role} role. Ask 5 relevant questions about their background and {', '.join(topics)}."
