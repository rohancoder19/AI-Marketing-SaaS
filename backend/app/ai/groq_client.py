import httpx
import json
import logging
from typing import Dict, Any
from app.ai.base import BaseAIClient
from app.config.config import settings

logger = logging.getLogger("groq_client")

class GroqAIClient(BaseAIClient):
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.3-70b-versatile"

    async def generate_json(self, prompt: str) -> Dict[str, Any]:
        if not self.api_key:
            logger.warning("GROQ_API_KEY is not defined in config. Seeding fallback mock campaign.")
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
                return json.loads(content_text)
            except Exception as e:
                logger.error(f"Groq API connection failure: {str(e)}")
                return self._generate_mock_fallback(prompt)

    def _generate_mock_fallback(self, prompt: str) -> Dict[str, Any]:
        num_variations = 3
        for i in range(1, 6):
            if f"exactly {i} variations" in prompt or f"exactly {i} post" in prompt:
                num_variations = i
                break

        platform = "LinkedIn"
        if "instagram" in prompt.lower():
            platform = "Instagram"
        elif "twitter" in prompt.lower() or "x (twitter)" in prompt.lower():
            platform = "X (Twitter)"
        elif "facebook" in prompt.lower():
            platform = "Facebook"
        elif "threads" in prompt.lower():
            platform = "Threads"
        elif "pinterest" in prompt.lower():
            platform = "Pinterest"

        posts = []
        for i in range(1, num_variations + 1):
            posts.append({
                "platform": platform,
                "title": f"The Evolution of Copywriting (Part {i})",
                "hook": f"💡 (Variation {i}) AI isn't going to replace copywriters, but copywriters who use AI will replace those who don't.",
                "caption": f"In B2B SaaS, velocity is everything. Traditional copywriting templates take hours to write, test, and adapt. With Aethera's advanced modular engine, you can generate variations that retain brand style, tone, and campaign goals perfectly.",
                "cta": "Read our full case study here. Link in profile.",
                "hashtags": ["copywriting", "innovation", "artificialintelligence", "saas"],
                "seo_keywords": ["AI Copywriting", "Content Velocity", "SaaS Growth"],
                "character_count": 340,
                "reading_time": "15s",
                "best_posting_time": "9:30 AM",
                "suggested_audience": "Founders, Content Leads, Marketing Managers",
                "engagement_tips": "Ask users in the comment section how long they currently spend drafting copy.",
                "image_prompt": "Clean professional studio shot of a sleek metallic digital canvas display sitting on a dark polished marble desk, soft violet neon backlighting, high-end commercial tech design aesthetic, 8K resolution.",
                "negative_prompt": "blurry, low quality, cluttered background, hand, text, watermarks",
                "suggested_image_style": "Minimalist Tech Product Photography",
                "suggested_color_palette": ["#030014", "#00f0ff", "#bd00ff"],
                "alt_text": "Close-up of a digital design workspace display featuring neon ambient glow.",
                "image_title": "Aethera Canvas Mesh",
                "engagement_score": 92 + i,
                "virality_score": 89 + i,
                "brand_consistency_score": 95,
                "readability_score": 88,
                "ai_score": 91
            })
        
        return {"posts": posts}
