from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# --- User Authentication Schemas ---

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None


# --- Advanced Social Media Generator Schemas ---

class PostGenerationRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=150)
    description: str = Field(..., min_length=5, max_length=1000)
    campaign_goal: str = "Brand Awareness"
    platform: str = "LinkedIn"
    tone: str = "Professional"
    target_audience: str = "General Audience"
    age_group: str = "25-34"
    industry: str = "Technology"
    brand_name: str = "Aethera"
    product_name: str = "Aethera SaaS"
    keywords: str = "AI, Marketing, SaaS"
    competitor: Optional[str] = None
    call_to_action: str = "Sign up for a free account"
    language: str = "English"
    creativity_level: str = "High"
    post_length: str = "Medium"
    emoji_usage: str = "Medium"
    num_variations: int = Field(3, ge=1, le=5)
    include_hashtags: bool = True
    include_cta: bool = True
    image_style: str = "Photorealistic"
    image_aspect_ratio: str = "1:1"
    image_mood: str = "Vibrant"
    brand_colors: str = "#00f0ff, #bd00ff"
    logo_url: Optional[str] = None

class PostVariation(BaseModel):
    platform: str
    title: str
    hook: str
    caption: str
    cta: str
    hashtags: List[str] = []
    seo_keywords: List[str] = []
    character_count: int
    reading_time: str
    best_posting_time: str
    suggested_audience: str
    engagement_tips: str
    image_prompt: str
    negative_prompt: str
    suggested_image_style: str
    suggested_color_palette: List[str] = []
    alt_text: str
    image_title: str
    image_url: Optional[str] = None
    engagement_score: int
    virality_score: int
    brand_consistency_score: int
    readability_score: int
    ai_score: int

class GenerationResponse(BaseModel):
    success: bool
    posts: List[PostVariation]

class HistoryResponse(BaseModel):
    id: str
    topic: str
    description: str
    platform: str
    tone: str
    campaign_goal: str
    target_audience: Optional[str] = None
    generated_content: List[PostVariation]
    image_prompt: Optional[str] = None
    favorite: bool
    created_at: datetime

    class Config:
        from_attributes = True

class FavoriteRequest(BaseModel):
    id: str
    favorite: bool

class RegenerateRequest(BaseModel):
    id: str
    variation_index: int

class ExportRequest(BaseModel):
    topic: str
    platform: str
    post: PostVariation

# --- Advertisement Generator Schemas ---

class AdvertisementGenerationRequest(BaseModel):
    campaign_name: str
    objective: str
    brand_name: str
    product_name: str
    industry: str
    company_description: str
    website_url: Optional[str] = None
    target_audience: str
    age_group: str
    gender: str
    location: str
    interests: str
    income_level: str
    occupation: str
    platform: str
    ad_type: str
    tone: str
    language: str
    creativity_level: str
    brand_voice: str
    emotional_trigger: str
    marketing_framework: str
    budget: str
    campaign_duration: str
    call_to_action: str
    competitor: Optional[str] = None
    keywords: str
    usp: str
    pain_points: str
    benefits: str
    image_style: str
    image_aspect_ratio: str
    image_mood: str
    brand_colors: str
    logo_url: Optional[str] = None
    num_variations: int = Field(3, ge=1, le=5)
    output_length: str = "Medium"

class AdVariation(BaseModel):
    headline: str
    primary_text: str
    description: str
    cta: str
    hook: str
    marketing_framework_used: str
    psychological_trigger: str
    target_audience_fit: str
    pain_points: str
    benefits: str
    usp: str
    seo_keywords: List[str] = []
    google_keywords: List[str] = []
    hashtags: List[str] = []
    estimated_ctr: str
    estimated_conversion_score: int
    ad_quality_score: int
    virality_score: int
    image_prompt: str
    negative_prompt: str
    suggested_color_palette: List[str] = []
    alt_text: str
    video_prompt: str
    carousel_ideas: str
    best_posting_time: str
    id: Optional[int] = None

class AdvertisementResponse(BaseModel):
    success: bool
    posts: List[AdVariation]

class AdvertisementHistoryResponse(BaseModel):
    id: str
    campaign_name: Optional[str] = None
    platform: Optional[str] = None
    objective: Optional[str] = None
    product: Optional[str] = None
    brand: Optional[str] = None
    audience: Optional[str] = None
    generated_content: List[AdVariation]
    image_prompt: Optional[str] = None
    favorite: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Email Generator Schemas ---

class EmailGenerationRequest(BaseModel):
    campaign_name: str
    email_type: str = "Cold Outreach"
    target_audience: str
    product_name: str
    value_proposition: str
    call_to_action: str
    tone: str = "Professional"
    sender_name: str = "Aethera Team"
    sender_role: str = "Marketing"
    company_name: str = "Aethera"
    personalization_instructions: Optional[str] = None
    email_length: str = "Short"
    subject_line_style: str = "Curiosity"
    num_variations: int = Field(3, ge=1, le=5)

class EmailVariation(BaseModel):
    subject_line: str
    preheader: str
    salutation: str
    body_paragraphs: List[str]
    call_to_action_text: str
    sign_off: str
    ps_note: Optional[str] = None
    spam_word_score: int
    readability_score: int
    estimated_open_rate: str
    estimated_click_rate: str
    psychological_framework: str
    id: Optional[str] = None

class EmailResponse(BaseModel):
    success: bool
    posts: List[EmailVariation]

class EmailHistoryResponse(BaseModel):
    id: str
    campaign_name: str
    email_type: str
    target_audience: str
    product_name: str
    generated_content: List[EmailVariation]
    favorite: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ExportEmailRequest(BaseModel):
    campaign_name: str
    post: EmailVariation

class SendGmailRequest(BaseModel):
    sender_email: EmailStr
    app_password: str
    recipient_email: EmailStr
    subject: str
    body: str

