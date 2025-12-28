# config.py
import os

class Config:
    """Configuration settings"""
    
    # Paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODEL_DIR = os.path.join(BASE_DIR, 'models')
    MODEL_PATH = os.path.join(MODEL_DIR, 'crime_prediction_model.h5')
    SCALERS_PATH = os.path.join(MODEL_DIR, 'scalers.pkl')
    CONFIG_PATH = os.path.join(MODEL_DIR, 'model_config.pkl')
    DATA_PATH = os.path.join(MODEL_DIR, 'reference_data.parquet')

    
    # Server settings
    HOST = '0.0.0.0'
    PORT = 5000
    DEBUG = True  # Set to False in production
    
    # API settings
    MAX_BATCH_SIZE = 50
    REQUEST_TIMEOUT = 30
    
    # CORS settings
    CORS_ORIGINS = [
        "http://localhost:5173"
    ]
