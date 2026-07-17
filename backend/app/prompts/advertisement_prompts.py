from app.schemas.schemas import AdvertisementGenerationRequest

class AdvertisementPrompts:
    @staticmethod
    def build_generation_prompt(req: AdvertisementGenerationRequest) -> str:
        prompt = f"""You are a Senior Meta Ads Expert, Google Ads Specialist, Creative Director, and Consumer Psychologist.
Generate exactly {req.num_variations} variations of an advertisement for the brand '{req.brand_name}' promoting product '{req.product_name}' in a valid, parsable JSON format.

Input Context Parameters:
- Campaign Name: {req.campaign_name}
- Objective: {req.objective}
- Industry: {req.industry}
- Company Description: {req.company_description}
- Website URL: {req.website_url or "None"}
- Target Audience: {req.target_audience} (Age Group: {req.age_group}, Gender: {req.gender}, Location: {req.location})
- Interests: {req.interests}
- Income Level: {req.income_level}
- Occupation: {req.occupation}
- Target Platform: {req.platform}
- Ad Type: {req.ad_type}
- Writing Tone: {req.tone}
- Language: {req.language}
- Creativity Level: {req.creativity_level}
- Brand Voice: {req.brand_voice}
- Emotional Trigger: {req.emotional_trigger}
- Marketing Framework: {req.marketing_framework}
- Budget Constraints: {req.budget}
- Campaign Duration: {req.campaign_duration}
- Target Call To Action (CTA): {req.call_to_action}
- Focus Keywords: {req.keywords}
- USP: {req.usp}
- Pain Points: {req.pain_points}
- Benefits: {req.benefits}
- Competitor context (if any): {req.competitor or "None"}
- Length Target: {req.output_length}

Visual Asset Prompt Requirements:
- Suggested Visual Mood: {req.image_mood}
- Suggested Image Style: {req.image_style}
- Target Aspect Ratio: {req.image_aspect_ratio}
- Brand Colors: {req.brand_colors}
- Logo parameters: {req.logo_url or "None"}

Generate an ultra-detailed image prompt suitable for Stable Diffusion, FLUX, or Midjourney. Describe composition, studio lighting, camera angle, realistic shadows, color schemes matching the brand colors ({req.brand_colors}), and negative prompts to filter out bad renders. Also include ideas for Video and Carousels.

Strict JSON Response Format:
Your output must be a single JSON object (with no markdown wrappers, no backticks, and no text before or after the JSON). The JSON must conform exactly to this schema:
{{
  "posts": [
    {{
      "headline": "Punchy, attention-grabbing headline",
      "primary_text": "The main ad copy matching the framework and tone",
      "description": "Additional description or link description",
      "cta": "The call to action text",
      "hook": "The specific hook used to capture attention",
      "marketing_framework_used": "e.g., AIDA, PAS",
      "psychological_trigger": "The emotional/psychological trigger applied",
      "target_audience_fit": "Why this ad appeals to the target demographic",
      "pain_points": "Pain points addressed",
      "benefits": "Core benefits highlighted",
      "usp": "The unique selling proposition highlighted",
      "seo_keywords": ["list", "of", "keywords"],
      "google_keywords": ["list", "of", "biddable", "keywords"],
      "hashtags": ["list", "of", "hashtags"],
      "estimated_ctr": "Estimated CTR e.g., '2.5%'",
      "estimated_conversion_score": 90,
      "ad_quality_score": 95,
      "virality_score": 85,
      "image_prompt": "Ultra-detailed prompt for AI image generation...",
      "negative_prompt": "Negative prompt text filtering out deformities...",
      "suggested_color_palette": ["list", "of", "hex", "colors"],
      "alt_text": "Descriptive alt text for the image",
      "video_prompt": "A prompt describing a 5-15 second video hook/concept",
      "carousel_ideas": "Brief description of 3-5 carousel slide contents",
      "best_posting_time": "Estimated optimal time to launch/post"
    }}
  ]
}}

Generate exactly {req.num_variations} variations inside the 'posts' array. Return ONLY the JSON object.
"""
        return prompt
