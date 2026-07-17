import httpx
import json
import logging
from typing import Dict, Any
from app.config.config import settings

logger = logging.getLogger("ai_service")

class AIService:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.3-70b-versatile"

    async def generate_content(self, prompt: str) -> Dict[str, Any]:
        # If API key is empty, run clientside fallback simulator
        if not self.api_key:
            logger.warning("GROQ_API_KEY is not defined in configuration. Invoking local database mockup generator.")
            return self._generate_mock_fallback(prompt)

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "response_format": {
                "type": "json_object"
            },
            "temperature": 0.75
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            try:
                response = await client.post(self.url, headers=headers, json=payload)
                if response.status_code != 200:
                    logger.error(f"Groq API error status {response.status_code}: {response.text}")
                    return self._generate_mock_fallback(prompt)
                
                res_data = response.json()
                content_text = res_data["choices"][0]["message"]["content"]
                
                # Parse to dict
                return json.loads(content_text)
            except Exception as e:
                logger.error(f"Groq API connection failure: {str(e)}")
                return self._generate_mock_fallback(prompt)

    def _generate_mock_fallback(self, prompt: str) -> Dict[str, Any]:
        # Determine parameters from prompt text to generate high-fidelity fallbacks
        num_variations = 3
        for i in range(1, 6):
            if f"exactly {i} variations" in prompt:
                num_variations = i
                break

        platform = "LinkedIn"
        if "instagram" in prompt.lower():
            platform = "Instagram"
        elif "twitter" in prompt.lower() or "x / twitter" in prompt.lower():
            platform = "X (Twitter)"
        elif "facebook" in prompt.lower():
            platform = "Facebook"
        elif "threads" in prompt.lower():
            platform = "Threads"

        posts = []
        for i in range(1, num_variations + 1):
            if platform == "LinkedIn":
                posts.append({
                    "hook": f"💡 (Variation {i}) AI isn't going to replace copywriters, but copywriters who use AI will replace those who don't.",
                    "caption": f"In B2B SaaS, the difference between failure and success comes down to velocity. Aethera handles copywriting drafts at scale, keeping our team focused on strategic insights and high-level campaign metrics.",
                    "cta": "Read our full case study here. Link in profile.",
                    "hashtags": ["copywriting", "innovation", "artificialintelligence", "saas"],
                    "character_count": 310,
                    "reading_time": "15s"
                })
            elif platform == "Instagram":
                posts.append({
                    "hook": f"✨ (Variation {i}) Scale your marketing by 10x today! ⚡",
                    "caption": f"Stop spending hours staring at a blank screen. Aethera AI writes high-converting copy in seconds, custom-made for your target audience.",
                    "cta": "Click the link in bio to start free! 👉",
                    "hashtags": ["instamarketing", "aitechnology", "growthhacking"],
                    "character_count": 210,
                    "reading_time": "9s"
                })
            elif platform == "X (Twitter)":
                posts.append({
                    "hook": f"🔥 (Variation {i}) Stop wasting hours writing hooks.",
                    "caption": "Aethera AI generates high-converting marketing copy in seconds.",
                    "cta": "Get started free: aethera.ai",
                    "hashtags": ["saas", "growth"],
                    "character_count": 130,
                    "reading_time": "6s"
                })
            else:
                posts.append({
                    "hook": f"📣 (Variation {i}) Introducing the future of AI marketing.",
                    "caption": "Aethera AI is a modular copy sandbox designed to help teams scale campaign drafts.",
                    "cta": "Leave a comment to access the preview!",
                    "hashtags": ["startup", "future"],
                    "character_count": 150,
                    "reading_time": "8s"
                })
        
        return {"posts": posts}

ai_service = AIService()
