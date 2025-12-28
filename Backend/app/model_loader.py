# app/model_loader.py
import pickle
import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer
import tensorflow as tf
from config import Config

class Attention(Layer):
    """Attention layer - must match training definition"""
    def __init__(self, **kwargs):
        super(Attention, self).__init__(**kwargs)
    
    def build(self, input_shape):
        self.W = self.add_weight(
            name="att_weight", 
            shape=(input_shape[-1], 1),
            initializer="glorot_uniform", 
            trainable=True
        )
        super(Attention, self).build(input_shape)
    
    def call(self, inputs):
        score = tf.tensordot(inputs, self.W, axes=[[2], [0]])
        alpha = tf.nn.softmax(score, axis=1)
        context = tf.reduce_sum(inputs * alpha, axis=1)
        return context

class ModelLoader:
    """Load and manage the trained model"""
    
    def __init__(self):
        self.model = None
        self.target_scaler = None
        self.feature_scaler = None
        self.label_encoders = None
        self.config = None
        self.df = None
        
    def load_all(self):
        """Load model, scalers, config, and reference data"""
        print("="*80)
        print("📦 LOADING MODEL AND DATA")
        print("="*80)
        
        # Load Keras model
        print("\n1. Loading neural network model...")
        self.model = load_model(
            Config.MODEL_PATH, 
            custom_objects={'Attention': Attention}
        )
        print(f"   ✅ Model loaded: {self.model.count_params():,} parameters")
        
        # Load scalers and encoders
        print("\n2. Loading preprocessing objects...")
        with open(Config.SCALERS_PATH, 'rb') as f:
            scalers = pickle.load(f)
            self.target_scaler = scalers['target_scaler']
            self.feature_scaler = scalers['feature_scaler']
            self.label_encoders = scalers['label_encoders']
        print("   ✅ Scalers and encoders loaded")
        
        # Load configuration
        print("\n3. Loading configuration...")
        with open(Config.CONFIG_PATH, 'rb') as f:
            self.config = pickle.load(f)
        print(f"   ✅ Config loaded")
        print(f"      - Sequence Length: {self.config['SEQ_LEN']}")
        print(f"      - Features: {len(self.config['numeric_features'])}")
        
        # Load reference data
        print("\n4. Loading reference dataset...")
        self.df = pd.read_parquet(Config.DATA_PATH)
        print(f"   ✅ Reference data loaded: {len(self.df):,} records")
        
        print("\n" + "="*80)
        print("✅ ALL COMPONENTS LOADED SUCCESSFULLY")
        print("="*80)
        
        return self
    
    def get_model(self):
        return self.model
    
    def get_scalers(self):
        return self.target_scaler, self.feature_scaler, self.label_encoders
    
    def get_config(self):
        return self.config
    
    def get_reference_data(self):
        return self.df

# Global model loader instance
model_loader = ModelLoader()