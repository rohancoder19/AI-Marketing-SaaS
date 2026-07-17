import json
from app.schemas.schemas import EmailGenerationRequest

class EmailPrompts:
    @staticmethod
    def build_generation_prompt(req: EmailGenerationRequest) -> str:
        prompt = f"""You are an elite Email Marketing Copywriter and Conversion Strategist.
Your task is to write {req.num_variations} variations of a highly converting email based on the parameters below.

--- Campaign Details ---
Campaign Name: {req.campaign_name}
Email Type: {req.email_type}
Target Audience: {req.target_audience}
Product/Service: {req.product_name}
Value Proposition: {req.value_proposition}
Call to Action (CTA): {req.call_to_action}
Tone: {req.tone}
Sender Name: {req.sender_name}
Sender Role: {req.sender_role}
Company Name: {req.company_name}
Email Length: {req.email_length}
Subject Line Style: {req.subject_line_style}
Personalization Instructions: {req.personalization_instructions or 'None'}

--- Output Format ---
You MUST return ONLY a single valid JSON object. Do not wrap it in markdown block quotes (```json ... ```). It must precisely match this schema:

{{
  "posts": [
    {{
      "subject_line": "Catchy subject line",
      "preheader": "Short preview text that complements the subject",
      "salutation": "Greeting (e.g., Hi [First Name],)",
      "body_paragraphs": [
        "Paragraph 1 text",
        "Paragraph 2 text"
      ],
      "call_to_action_text": "The exact hyperlinked CTA text",
      "sign_off": "Best regards, etc.",
      "ps_note": "Optional P.S. note",
      "spam_word_score": 10,  // Integer out of 100 (lower is better, meaning less likely to hit spam)
      "readability_score": 85, // Integer out of 100 (higher is more readable)
      "estimated_open_rate": "35%",
      "estimated_click_rate": "5%",
      "psychological_framework": "AIDA (Attention, Interest, Desire, Action)"
    }}
  ]
}}

Ensure you generate exactly {req.num_variations} variations in the 'posts' array.
"""
        return prompt
