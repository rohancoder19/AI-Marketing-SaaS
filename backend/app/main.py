from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from beanie import init_beanie

from app.config.config import settings
from app.routers import social_router, auth_router, advertisement_router, email_router
from app.models.models import User, SocialMediaHistory, AdvertisementHistory, EmailHistory
from app.database.session import init_db, close_db, db

from fastapi import Request
from fastapi.responses import JSONResponse
import traceback
import asyncio

db_init_lock = None
db_initialized = False

async def initialize_db_if_needed():
    global db_initialized, db_init_lock
    if db_init_lock is None:
        db_init_lock = asyncio.Lock()
    if not db_initialized:
        async with db_init_lock:
            if not db_initialized:
                # Initialize Motor client
                await init_db()
                
                # Initialize Beanie
                await init_beanie(
                    database=db.client.get_database("ai_marketing_generator"),
                    document_models=[User, SocialMediaHistory, AdvertisementHistory, EmailHistory]
                )
                
                # Seed default user for public access bypass
                existing_user = await User.find_one(User.email == "admin@aethera.ai")
                if not existing_user:
                    from app.auth.auth import get_password_hash
                    new_user = User(
                        email="admin@aethera.ai",
                        hashed_password=get_password_hash("password123"),
                        full_name="Default Marketer"
                    )
                    await new_user.insert()
                elif not existing_user.hashed_password.startswith("$2"):
                    from app.auth.auth import get_password_hash
                    existing_user.hashed_password = get_password_hash("password123")
                    await existing_user.save()
                    
                db_initialized = True

@asynccontextmanager
async def lifespan(app: FastAPI):
    await initialize_db_if_needed()
    yield
    # Close Motor client
    await close_db()


app = FastAPI(
    title="AI Marketing Agent - Content Generator API",
    description="Backend API for AI Marketing Content Generator Module",
    version="1.0.0",
    lifespan=lifespan
)

@app.middleware("http")
async def ensure_db_middleware(request: Request, call_next):
    await initialize_db_if_needed()
    return await call_next(request)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "traceback": tb.splitlines()
        }
    )
# Configure CORS for frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to client domain in production environments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(social_router.router, prefix="/api/social-media", tags=["Social Media Generator"])
app.include_router(advertisement_router.router, prefix="/api/advertisement", tags=["Advertisement Generator"])
app.include_router(email_router.router, prefix="/api/email", tags=["Email Generator"])

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "Aethera AI API Service"}
