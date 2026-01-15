"""
Application Configuration
"""
import os


class Config:
    """Configuration settings for the Flask application."""
    
    # MongoDB Configuration
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/')
    MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME', 'rtsp_overlay_db')
    
    # Flask Configuration
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # CORS Configuration - comma-separated list of allowed origins
    # Example: CORS_ORIGINS="http://localhost:3000,http://localhost:5173,https://myapp.com"
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
