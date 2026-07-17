import logging
from typing import List, Dict, Any
from beanie import PydanticObjectId
from app.models.models import SocialMediaHistory, User
from app.schemas.schemas import PostGenerationRequest
from app.prompts.social_prompts import SocialPrompts
from app.ai.groq_client import GroqAIClient

logger = logging.getLogger("social_service")

class SocialService:
    def __init__(self):
        self.ai_client = GroqAIClient()

    async def generate_campaign(self, req: PostGenerationRequest) -> Dict[str, Any]:
        # 1. Build prompt
        prompt = SocialPrompts.build_generation_prompt(req)
        
        # 2. Call modular AI client
        ai_output = await self.ai_client.generate_json(prompt)
        posts_list = ai_output.get("posts", [])
        
        if not posts_list:
            raise ValueError("Model response was empty or malformed.")

        # Extract main image prompt from first variation
        main_img_prompt = posts_list[0].get("image_prompt", "")
        
        # We assume user 1 exists, get first user
        default_user = await User.find_one()
        if not default_user:
            raise ValueError("Default user not found.")

        # 3. Log details in DB history logs
        history_entry = SocialMediaHistory(
            user_id=default_user.id,
            topic=req.topic,
            description=req.description,
            platform=req.platform,
            tone=req.tone,
            campaign_goal=req.campaign_goal,
            target_audience=req.target_audience,
            generated_content={"posts": posts_list},
            image_prompt=main_img_prompt,
            favorite=False
        )
        await history_entry.insert()

        # Attach database record ID to output for quick references
        for post in posts_list:
            post["id"] = str(history_entry.id)

        return {"success": True, "posts": posts_list}

    async def regenerate_variation(self, request_id: str, var_idx: int) -> Dict[str, Any]:
        entry = await SocialMediaHistory.get(PydanticObjectId(request_id))
        if not entry:
            raise ValueError("History campaign record not found.")

        # Re-fetch form variables using entry properties to build a regeneration prompt
        re_prompt = f"""You are a professional social media manager.
Regenerate Variant {var_idx + 1} of this social media post:
Topic: {entry.topic}
Description: {entry.description}
Platform: {entry.platform}
Tone: {entry.tone}

Output format:
Return ONLY a single valid JSON object containing exactly ONE post inside 'posts' array representing Variant {var_idx + 1}. Do not return other text or wrappers.
"""
        ai_output = await self.ai_client.generate_json(re_prompt)
        posts_list = ai_output.get("posts", [])
        if not posts_list:
            raise ValueError("Failed to regenerate variation.")

        new_post = posts_list[0]
        
        # Update specific variation index in DB content list
        current_content = entry.generated_content.get("posts", [])
        if 0 <= var_idx < len(current_content):
            current_content[var_idx] = new_post
            entry.generated_content["posts"] = current_content
            await entry.save()

        return {"success": True, "posts": entry.generated_content.get("posts", [])}

    async def get_history(self) -> List[SocialMediaHistory]:
        default_user = await User.find_one()
        if not default_user:
            return []
        # Return posts for this user, sorted by created_at desc
        return await SocialMediaHistory.find(
            SocialMediaHistory.user_id.id == default_user.id
        ).sort(-SocialMediaHistory.created_at).to_list()

    async def delete_history_entry(self, entry_id: str) -> bool:
        entry = await SocialMediaHistory.get(PydanticObjectId(entry_id))
        if not entry:
            return False
        await entry.delete()
        return True

    async def toggle_favorite(self, entry_id: str, favorite: bool) -> bool:
        entry = await SocialMediaHistory.get(PydanticObjectId(entry_id))
        if not entry:
            return False
        entry.favorite = favorite
        await entry.save()
        return True

social_service = SocialService()
