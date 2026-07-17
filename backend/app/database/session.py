import certifi
from pymongo import AsyncMongoClient
from app.config.config import settings

class Database:
    client: AsyncMongoClient = None

db = Database()

async def init_db():
    db.client = AsyncMongoClient(settings.DATABASE_URL, tlsCAFile=certifi.where())
    # We will initialize beanie models in main.py

async def close_db():
    if db.client:
        await db.client.close()
