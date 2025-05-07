import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration settings
class Config:
    PORT = int(os.getenv('PORT', 4001))
    MONGODB_URI = os.getenv('MONGODB_URI')
    JWT_SECRET = os.getenv('JWT_SECRET')
    JWT_EXPIRATION = int(os.getenv('JWT_EXPIRATION', 3600))  # Default to 1 hour in seconds
