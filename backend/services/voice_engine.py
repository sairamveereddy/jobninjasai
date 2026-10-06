import io
import os
import logging
import asyncio
import base64
import boto3
from typing import Dict, Any, List
from groq import AsyncGroq
from services.ai_portfolio_service import AIPortfolioService

logger = logging.getLogger(__name__)

# AWS Polly Client
polly = boto3.client(
    'polly',
    region_name=os.getenv('AWS_REGION', 'us-east-1'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

class VoiceEngine:
    _instance = None
    _groq_client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VoiceEngine, cls).__new__(cls)
        return cls._instance

    def get_client(self):
        if self._groq_client is None:
            # Fallback API key, expects actual key in env
            self._groq_client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY", "dummy"))
        return self._groq_client

    async def transcribe(self, audio_bytes: bytes) -> str:
        """Convert audio bytes (e.g. from web) to text."""
        client = self.get_client()
        try:
            # Groq audio transcriptions expect a tuple (filename, file_content)
            response = await client.audio.transcriptions.create(
                file=("audio.wav", audio_bytes),
                model="whisper-large-v3"
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"Transcription error: {e}")
            return ""

    async def synthesize(self, text: str, voice_id: str = "Joanna") -> bytes:
        """Convert text to speech bytes using AWS Polly."""
        try:
            response = polly.synthesize_speech(
                Text=text,
                OutputFormat='mp3',
                VoiceId=voice_id,
                Engine='neural'
            )
            return response['AudioStream'].read()
        except Exception as e:
            logger.error(f"TTS error: {e}")
            return b""

class VoiceSocketHandler:
    """Manages the WebSocket lifecycle for a voice session with usage limits."""
    
    def __init__(self, websocket, public_id: str, visitor_email: str = "anonymous"):
        self.websocket = websocket
        self.public_id = public_id
        self.visitor_email = visitor_email
        self.portfolio_service = AIPortfolioService()
        self.voice_engine = VoiceEngine()
        self.history = []
        self.total_seconds = 0
        self.limit_seconds = 30 # 30 seconds for free tier
        self.is_pro = False

    async def start(self):
        from rds_service import get_ai_portfolio_by_public_id, get_voice_usage, update_voice_usage
        
        await self.websocket.accept()
        
        # Check portfolio and plan
        portfolio = get_ai_portfolio_by_public_id(self.public_id)
        if not portfolio:
            await self.websocket.send_json({"type": "error", "message": "Portfolio not found"})
            await self.websocket.close()
            return

        self.is_pro = portfolio.get("user_plan") != "free"
        
        # Check existing usage if free
        if not self.is_pro:
            usage = get_voice_usage(portfolio["id"], self.visitor_email)
            if usage and usage['seconds_used'] >= self.limit_seconds:
                await self.websocket.send_json({
                    "type": "limit_reached", 
                    "message": "Free tier voice limit reached (30s/2hrs). Upgrade to Pro for unlimited access!"
                })
                await self.websocket.close()
                return
            self.total_seconds = usage['seconds_used'] if usage else 0

        logger.info(f"Voice session started for portfolio: {self.public_id} (Pro: {self.is_pro})")
        
        # Send initial greeting
        context = await self.portfolio_service.get_portfolio_context(self.public_id)
        if context:
            name = context['profile']['name']
            greeting = f"Hi there! I'm the AI representative for {name}. How can I help you today?"
            audio = await self.voice_engine.synthesize(greeting)
            
            # Approximate duration (150 words per minute -> 2.5 words per second)
            words = len(greeting.split())
            duration = max(2, int(words / 2.5))
            
            if not self.is_pro:
                self.total_seconds += duration
                update_voice_usage(portfolio["id"], self.visitor_email, duration)

            await self.websocket.send_json({
                "type": "audio",
                "data": base64.b64encode(audio).decode('utf-8'),
                "text": greeting,
                "seconds_remaining": self.limit_seconds - self.total_seconds if not self.is_pro else None
            })
            self.history.append({"role": "assistant", "content": greeting})

        try:
            while True:
                data = await self.websocket.receive_json()
                
                if not self.is_pro and self.total_seconds >= self.limit_seconds:
                    await self.websocket.send_json({
                        "type": "limit_reached", 
                        "message": "Voice limit reached. Upgrade to Pro for more!"
                    })
                    break

                if data['type'] == 'audio':
                    audio_bytes = base64.b64decode(data['data'])
                    transcript = await self.voice_engine.transcribe(audio_bytes)
                    
                    if transcript:
                        await self.websocket.send_json({"type": "transcript", "text": transcript})
                        
                        response_text = await self.portfolio_service.generate_response(
                            self.public_id, self.history, transcript
                        )
                        audio_resp = await self.voice_engine.synthesize(response_text)
                        
                        # Calculate duration
                        words = len(response_text.split())
                        duration = max(2, int(words / 2.5))
                        
                        if not self.is_pro:
                            self.total_seconds += duration
                            update_voice_usage(portfolio["id"], self.visitor_email, duration)

                        await self.websocket.send_json({
                            "type": "audio",
                            "data": base64.b64encode(audio_resp).decode('utf-8'),
                            "text": response_text,
                            "seconds_remaining": self.limit_seconds - self.total_seconds if not self.is_pro else None
                        })
                        
                        self.history.append({"role": "user", "content": transcript})
                        self.history.append({"role": "assistant", "content": response_text})
                
                elif data['type'] == 'ping':
                    await self.websocket.send_json({"type": "pong"})

        except Exception as e:
            logger.info(f"Voice session ended: {e}")
        finally:
            try:
                await self.websocket.close()
            except:
                pass
