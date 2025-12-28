# app/__init__.py
from flask import Flask
from flask_cors import CORS
from config import Config

def create_app():
    """Application factory"""
    
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    from .routes import api
    app.register_blueprint(api)
    
    # Load model on startup
    print("\n" + "="*80)
    print("🚀 INITIALIZING CRIME PREDICTION API")
    print("="*80)
    
    from .model_loader import model_loader
    model_loader.load_all()
    
    
    print("\n" + "="*80)
    print("✅ API READY TO ACCEPT REQUESTS")
    print("="*80 + "\n")
    
    return app