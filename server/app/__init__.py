"""
Flask Application Factory
"""
from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.db import init_db


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Enable CORS for React frontend (origins configurable via CORS_ORIGINS env var)
    CORS(app, origins=Config.CORS_ORIGINS)
    
    # Initialize MongoDB connection
    init_db(app)
    
    # Register blueprints
    from app.routes.overlays import overlays_bp
    from app.routes.stream import stream_bp
    app.register_blueprint(overlays_bp)
    app.register_blueprint(stream_bp)
    
    @app.route('/health', methods=['GET'])
    def health_check():
        return {"status": "healthy", "message": "RTSP Overlay API is running"}
    
    return app
