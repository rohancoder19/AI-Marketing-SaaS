import logging
from typing import List, Dict, Any
from beanie import PydanticObjectId
from app.models.models import AdvertisementHistory, User
from app.schemas.schemas import AdvertisementGenerationRequest
from app.prompts.advertisement_prompts import AdvertisementPrompts
from app.ai.groq_client import GroqAIClient

logger = logging.getLogger("advertisement_service")

class AdvertisementService:
    def __init__(self):
        self.ai_client = GroqAIClient()

    async def generate_campaign(self, req: AdvertisementGenerationRequest) -> Dict[str, Any]:
        prompt = AdvertisementPrompts.build_generation_prompt(req)
        
        ai_output = await self.ai_client.generate_json(prompt)
        posts_list = ai_output.get("posts", [])
        
        if not posts_list:
            raise ValueError("Model response was empty or malformed.")

        main_img_prompt = posts_list[0].get("image_prompt", "")

        default_user = await User.find_one()
        if not default_user:
            raise ValueError("Default user not found.")

        history_entry = AdvertisementHistory(
            user_id=default_user.id,
            campaign_name=req.campaign_name,
            platform=req.platform,
            objective=req.objective,
            product=req.product_name,
            brand=req.brand_name,
            audience=req.target_audience,
            generated_content={"posts": posts_list},
            image_prompt=main_img_prompt,
            favorite=False
        )
        await history_entry.insert()

        for post in posts_list:
            post["id"] = str(history_entry.id)

        return {"success": True, "posts": posts_list}

    async def regenerate_variation(self, request_id: str, var_idx: int) -> Dict[str, Any]:
        entry = await AdvertisementHistory.get(PydanticObjectId(request_id))
        if not entry:
            raise ValueError("Advertisement campaign record not found.")

        re_prompt = f"""You are a Senior Meta Ads Expert and Google Ads Specialist.
Regenerate Variant {var_idx + 1} of this advertisement:
Campaign Name: {entry.campaign_name}
Platform: {entry.platform}
Objective: {entry.objective}

Output format:
Return ONLY a single valid JSON object containing exactly ONE post inside 'posts' array representing Variant {var_idx + 1}. Do not return other text or wrappers.
"""
        ai_output = await self.ai_client.generate_json(re_prompt)
        posts_list = ai_output.get("posts", [])
        if not posts_list:
            raise ValueError("Failed to regenerate variation.")

        new_post = posts_list[0]
        
        current_content = entry.generated_content.get("posts", [])
        if 0 <= var_idx < len(current_content):
            current_content[var_idx] = new_post
            entry.generated_content["posts"] = current_content
            await entry.save()

        return {"success": True, "posts": entry.generated_content.get("posts", [])}

    async def get_history(self) -> List[AdvertisementHistory]:
        default_user = await User.find_one()
        if not default_user:
            return []
        return await AdvertisementHistory.find(
            AdvertisementHistory.user_id.id == default_user.id
        ).sort(-AdvertisementHistory.created_at).to_list()

    async def delete_history_entry(self, entry_id: str) -> bool:
        entry = await AdvertisementHistory.get(PydanticObjectId(entry_id))
        if not entry:
            return False
        await entry.delete()
        return True

    async def toggle_favorite(self, entry_id: str, favorite: bool) -> bool:
        entry = await AdvertisementHistory.get(PydanticObjectId(entry_id))
        if not entry:
            return False
        entry.favorite = favorite
        await entry.save()
        return True

advertisement_service = AdvertisementService()
