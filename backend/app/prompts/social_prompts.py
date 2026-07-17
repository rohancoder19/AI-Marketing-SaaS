from app.schemas.schemas import PostGenerationRequest

class SocialPrompts:
    @staticmethod
    def build_generation_prompt(req: PostGenerationRequest) -> str:
        # Platform Specific Style Guidelines
        platform_guides = {
            "instagram": "Instagram Style: High emotional hook, visually descriptive tone, spacing, heavy relevant emojis.",
            "linkedin": "LinkedIn Style: Thought leadership, professional, structured bullet points, key metrics, minimal emojis.",
            "facebook": "Facebook Style: Community-oriented, inviting, conversational, asks questions.",
            "x (twitter)": "X / Twitter Style: Max 280 characters. Extremely punchy, no filler words, strong hooks.",
            "threads": "Threads Style: Informal, conversational, authentic, direct dialogue, friendly.",
            "pinterest": "Pinterest Style: Highly visual description, SEO keywords heavy, helpful tips.",
            "tiktok": "TikTok Style: Trendy, youth-focused hooks, conversational, includes script-style outlines if applicable.",
            "youtube community": "YouTube Community Style: Long-form engagement post, includes poll questions or feedback queries."
        }

        platform_key = req.platform.lower()
        platform_guide = platform_guides.get(platform_key, "Write engaging content suitable for modern audiences.")

        # Construct prompt
        prompt = f"""You are a professional Staff AI Marketing Copywriter, Product Designer, and Image Prompt Engineer.
Generate exactly {req.num_variations} variations of a social media post for the brand '{req.brand_name}' promoting product '{req.product_name}' in a valid, parsable JSON format.

Input Context Parameters:
- Topic: {req.topic}
- Description: {req.description}
- Campaign Goal: {req.campaign_goal}
- Target Platform: {req.platform}
- Writing Tone: {req.tone}
- Target Audience: {req.target_audience} (Age Group: {req.age_group})
- Industry Sector: {req.industry}
- Focus Keywords: {req.keywords}
- Competitor context (if any): {req.competitor or "None"}
- Target Call To Action (CTA): {req.call_to_action}
- Language: {req.language}
- Creativity Level: {req.creativity_level}
- Length Target: {req.post_length}
- Emoji Density: {req.emoji_usage}

Visual Asset Prompt Requirements:
- Suggested Visual Mood: {req.image_mood}
- Suggested Image Style: {req.image_style} (e.g. photorealistic, 3D render, minimalist, minimalist product photo)
- Target Aspect Ratio: {req.image_aspect_ratio}
- Brand Colors: {req.brand_colors}
- Logo parameters: {req.logo_url or "None"}

Generate an ultra-detailed image prompt suitable for Stable Diffusion, FLUX, or Midjourney. Describe composition, studio lighting, camera angle, realistic shadows, color schemes matching the brand colors ({req.brand_colors}), and negative prompts to filter out bad renders.

Formatting Instructions:
1. {platform_guide}
2. Adapts writing style and formatting to language: {req.language}.
3. Assign score values (0-100) representing: engagement_score, virality_score, brand_consistency_score, readability_score, and general ai_score.
4. Calculate exact character count of hook+caption+cta.
5. Estimate reading time (e.g. '12s', '5s', '35s').

Strict JSON Response Format:
Your output must be a single JSON object (with no markdown wrappers, no backticks, no markdown formatting fences, and no text before or after the JSON). The JSON must conform exactly to this schema:
{{
  "posts": [
    {{
      "platform": "{req.platform}",
      "title": "A short, catchy internal title for this variation.",
      "hook": "An attention-grabbing first line or hook.",
      "caption": "The main body/caption of the post matching the tone, industry, and length instructions.",
      "cta": "The call to action text matching the campaign goal and brand CTA.",
      "hashtags": ["list", "of", "hashtags"],
      "seo_keywords": ["list", "of", "seo", "keywords"],
      "character_count": 180,
      "reading_time": "12s",
      "best_posting_time": "Estimated optimal time to post based on audience demographics (e.g. '1:30 PM').",
      "suggested_audience": "Specific sub-demographics (e.g. 'Tech Entrepreneurs, Product Designers').",
      "engagement_tips": "Interactive ideas (e.g. 'Pin a comment asking if they prefer dark or light theme').",
      "image_prompt": "An ultra-detailed prompt for Stable Diffusion/FLUX detailing layout, lighting, colors ({req.brand_colors}), camera angle, composition, and high quality details.",
      "negative_prompt": "Negative prompt text filtering out deformities, bad text, low-res elements.",
      "suggested_image_style": "{req.image_style}",
      "suggested_color_palette": ["list", "of", "hex", "colors"],
      "alt_text": "Descriptive alt text for accessibility.",
      "image_title": "Short title describing the graphic visual asset.",
      "image_url": null,
      "engagement_score": 90,
      "virality_score": 85,
      "brand_consistency_score": 95,
      "readability_score": 90,
      "ai_score": 92
    }}
  ]
}}

Generate exactly {req.num_variations} variations inside the 'posts' array. Return ONLY the JSON object.
"""
        return prompt
