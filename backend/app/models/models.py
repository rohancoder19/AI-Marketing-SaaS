from beanie import Document, Link
from pydantic import Field, EmailStr
from datetime import datetime
from typing import List, Optional, Dict, Any

class User(Document):
    email: EmailStr = Field(unique=True, index=True)
    hashed_password: str
    full_name: Optional[str] = None
    
    class Settings:
        name = "users"

class SocialMediaHistory(Document):
    user_id: Link[User]
    topic: str
    description: str
    platform: Optional[str] = None
    tone: Optional[str] = None
    campaign_goal: Optional[str] = None
    target_audience: Optional[str] = None
    generated_content: Dict[str, Any]
    image_prompt: Optional[str] = None
    favorite: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "social_media_history"

class AdvertisementHistory(Document):
    user_id: Link[User]
    campaign_name: Optional[str] = None
    platform: Optional[str] = None
    objective: Optional[str] = None
    product: Optional[str] = None
    brand: Optional[str] = None
    audience: Optional[str] = None
    generated_content: Dict[str, Any]
    image_prompt: Optional[str] = None
    favorite: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "advertisement_history"

class EmailHistory(Document):
    user_id: Link[User]
    campaign_name: str
    email_type: str
    target_audience: str
    product_name: str
    generated_content: Dict[str, Any]
    favorite: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "email_history"
