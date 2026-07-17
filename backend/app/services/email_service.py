import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Dict, Any
from beanie import PydanticObjectId
from app.models.models import EmailHistory, User
from app.schemas.schemas import EmailGenerationRequest
from app.prompts.email_prompts import EmailPrompts
from app.ai.groq_client import GroqAIClient

logger = logging.getLogger("email_service")

class EmailService:
    def __init__(self):
        self.ai_client = GroqAIClient()

    async def generate_campaign(self, req: EmailGenerationRequest) -> Dict[str, Any]:
        prompt = EmailPrompts.build_generation_prompt(req)
        
        ai_output = await self.ai_client.generate_json(prompt)
        posts_list = ai_output.get("posts", [])
        
        if not posts_list:
            raise ValueError("Model response was empty or malformed.")

        default_user = await User.find_one()
        if not default_user:
            raise ValueError("Default user not found.")

        history_entry = EmailHistory(
            user_id=default_user.id,
            campaign_name=req.campaign_name,
            email_type=req.email_type,
            target_audience=req.target_audience,
            product_name=req.product_name,
            generated_content={"posts": posts_list},
            favorite=False
        )
        await history_entry.insert()

        for post in posts_list:
            post["id"] = str(history_entry.id)

        return {"success": True, "posts": posts_list}

    async def regenerate_variation(self, request_id: str, var_idx: int) -> Dict[str, Any]:
        entry = await EmailHistory.get(PydanticObjectId(request_id))
        if not entry:
            raise ValueError("Email campaign record not found.")

        # Re-build a prompt to regenerate just the specific variation
        re_prompt = f"""You are an elite Email Marketing Copywriter and Conversion Strategist.
Regenerate Variant {var_idx + 1} of this email campaign:
Campaign Name: {entry.campaign_name}
Email Type: {entry.email_type}
Target Audience: {entry.target_audience}
Product Name: {entry.product_name}

Output format:
Return ONLY a single valid JSON object containing exactly ONE post inside 'posts' array representing Variant {var_idx + 1}. Do not return other text or wrappers. It must match the following schema:
{{
  "posts": [
    {{
      "subject_line": "Catchy subject line",
      "preheader": "Short preview text",
      "salutation": "Greeting",
      "body_paragraphs": ["Paragraph 1", "Paragraph 2"],
      "call_to_action_text": "CTA text",
      "sign_off": "Sign off",
      "ps_note": "Optional P.S. note",
      "spam_word_score": 10,
      "readability_score": 85,
      "estimated_open_rate": "35%",
      "estimated_click_rate": "5%",
      "psychological_framework": "AIDA"
    }}
  ]
}}
"""
        ai_output = await self.ai_client.generate_json(re_prompt)
        posts_list = ai_output.get("posts", [])
        if not posts_list:
            raise ValueError("Failed to regenerate email variation.")

        new_post = posts_list[0]
        
        current_content = entry.generated_content.get("posts", [])
        if 0 <= var_idx < len(current_content):
            current_content[var_idx] = new_post
            entry.generated_content["posts"] = current_content
            await entry.save()

        return {"success": True, "posts": entry.generated_content.get("posts", [])}

    async def get_history(self) -> List[EmailHistory]:
        default_user = await User.find_one()
        if not default_user:
            return []
        return await EmailHistory.find(
            EmailHistory.user_id.id == default_user.id
        ).sort(-EmailHistory.created_at).to_list()

    async def delete_history_entry(self, entry_id: str) -> bool:
        entry = await EmailHistory.get(PydanticObjectId(entry_id))
        if not entry:
            return False
        await entry.delete()
        return True

    async def toggle_favorite(self, entry_id: str, favorite: bool) -> bool:
        entry = await EmailHistory.get(PydanticObjectId(entry_id))
        if not entry:
            return False
        entry.favorite = favorite
        await entry.save()
        return True

    def send_gmail_email(self, sender_email: str, app_password: str, recipient_email: str, subject: str, body: str) -> bool:
        try:
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = recipient_email
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain', 'utf-8'))

            # Setup Gmail SMTP connection over TLS
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(sender_email, app_password)
            server.sendmail(sender_email, recipient_email, msg.as_string())
            server.quit()
            logger.info(f"Successfully sent email from {sender_email} to {recipient_email}")
            return True
        except Exception as e:
            logger.error(f"Gmail SMTP Send Failure: {str(e)}")
            raise e

email_service = EmailService()
