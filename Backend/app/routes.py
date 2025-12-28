# app/routes.py
from flask import Blueprint, request, jsonify
from datetime import datetime
import numpy as np
import pandas as pd
from .model_loader import model_loader
from .reasoning_engine import ReasoningEngine
from .utils import (
    map_time_of_day, 
    map_season, 
    validate_datetime, 
    build_model_input,
    get_infrastructure_data
)

api = Blueprint('api', __name__)
reasoning_engine = ReasoningEngine()

@api.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({"status": "error", "message": "No data provided"}), 400
        
        required = ['pickup', 'drop', 'datetime']
        if not all(field in data for field in required):
            return jsonify({
                "status": "error", 
                "message": f"Missing required fields: {', '.join(f for f in required if f not in data)}"
            }), 400
        
        pickup = data['pickup']
        drop = data['drop']
        datetime_str = data['datetime']
        
        # Validate datetime
        valid, dt = validate_datetime(datetime_str)
        if not valid:
            return jsonify({
                "status": "error",
                "message": "Invalid datetime format. Use 'YYYY-MM-DD HH:MM:SS'"
            }), 400
        
        # Make prediction
        result = make_prediction(pickup, drop, datetime_str)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

def make_prediction(pickup, drop, datetime_str):
    """Core prediction logic"""
    
    # Get model components
    model = model_loader.get_model()
    target_scaler, _, _ = model_loader.get_scalers()
    config = model_loader.get_config()
    df = model_loader.get_reference_data()
    
    # Parse datetime
    dt = pd.to_datetime(datetime_str)
    tod = map_time_of_day(dt.hour)
    season = map_season(dt.month)
    is_weekend = dt.dayofweek >= 5
    
    # Build input
    inputs = build_model_input(pickup, drop, datetime_str, model_loader)
    
    # Get base prediction
    pred_norm = float(model.predict(inputs, verbose=0)[0][0])
    pred_raw = target_scaler.inverse_transform([[pred_norm]])[0][0]
    
    # Apply multipliers
    time_mult = config['TIME_MULTIPLIERS'][tod]
    season_mult = config['SEASON_MULTIPLIERS'][season]
    weekend_mult = config['WEEKEND_MULTIPLIER'] if is_weekend else 1.0
    
    adjusted = pred_raw * time_mult * season_mult * weekend_mult
    
    # Scale to 0-100%
    min_sev = df[config['TARGET_COL']].min()
    max_sev = df[config['TARGET_COL']].max()
    risk_pct = np.clip((adjusted - min_sev) / (max_sev - min_sev) * 100, 0, 100)
    
    # Get all time periods for comparison
    all_times = {}
    for time_name, hour in [("Morning", 8), ("Afternoon", 14), ("Evening", 19), ("Night", 23)]:
        test_dt = dt.replace(hour=hour)
        test_inputs = build_model_input(pickup, drop, test_dt.strftime("%Y-%m-%d %H:%M:%S"), model_loader)
        test_pred = float(model.predict(test_inputs, verbose=0)[0][0])
        test_raw = target_scaler.inverse_transform([[test_pred]])[0][0]
        
        test_tod = map_time_of_day(hour)
        test_mult = config['TIME_MULTIPLIERS'][test_tod] * season_mult * weekend_mult
        test_adjusted = test_raw * test_mult
        test_risk = np.clip((test_adjusted - min_sev) / (max_sev - min_sev) * 100, 0, 100)
        
        all_times[time_name] = {
            "risk_percent": float(test_risk),
            "safety_percent": float(100 - test_risk),
            "time_mult": config['TIME_MULTIPLIERS'][test_tod],
            "season_mult": season_mult,
            "weekend_mult": weekend_mult
        }
    
    # Get infrastructure data
    infra = get_infrastructure_data(pickup, drop, df)
    
    # Generate reasoning
    prediction_data = {
        'time_of_day': tod,
        'season': season,
        'is_weekend': is_weekend,
        'risk_percent': float(risk_pct)
    }
    
    reasoning = reasoning_engine.generate_full_reasoning(
        prediction_data, 
        infra, 
        all_times
    )
    
    # Build response
    sorted_times = sorted(all_times.items(), key=lambda x: x[1]["risk_percent"])
    
    return {
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "query": {
            "pickup_location": pickup,
            "drop_location": drop,
            "datetime": datetime_str,
            "formatted_datetime": dt.strftime('%B %d, %Y at %I:%M %p'),
            "time_of_day": tod,
            "season": season,
            "is_weekend": is_weekend,
            "day_name": dt.strftime('%A')
        },
        "risk_assessment": {
            "current_risk_percent": round(float(risk_pct), 2),
            "current_safety_percent": round(float(100 - risk_pct), 2),
            "risk_level": reasoning['risk_classification']['level'],
            "risk_color": reasoning['risk_classification']['color'],
            "risk_action": reasoning['risk_classification']['action'],
            "base_prediction": round(float(pred_raw), 4)
        },
        "multipliers": {
            "time_multiplier": round(float(time_mult), 2),
            "season_multiplier": round(float(season_mult), 2),
            "weekend_multiplier": round(float(weekend_mult), 2),
            "combined_multiplier": round(float(time_mult * season_mult * weekend_mult), 2)
        },
        "temporal_comparison": {
            time_name.lower(): {
                "risk_percent": round(data['risk_percent'], 2),
                "safety_percent": round(data['safety_percent'], 2)
            }
            for time_name, data in all_times.items()
        } | {
            "safest_time": sorted_times[0][0],
            "safest_risk_percent": round(sorted_times[0][1]['risk_percent'], 2),
            "riskiest_time": sorted_times[-1][0],
            "riskiest_risk_percent": round(sorted_times[-1][1]['risk_percent'], 2),
            "risk_range": round(sorted_times[-1][1]['risk_percent'] - sorted_times[0][1]['risk_percent'], 2)
        },
        "infrastructure": {
            "cctv_cameras": round(infra['cctv'], 1),
            "police_response_time_minutes": round(infra['response_time'], 1),
            "nearby_police_stations": round(infra['stations'], 1),
            "historical_incidents": infra['count'],
            "infrastructure_score": round(
                min(100, (infra['cctv']/20)*30 + (20-min(infra['response_time'],20))/20*40 + (infra['stations']/5)*30), 
                1
            )
        },
        "reasoning": {
            "primary_risk_factors": reasoning['primary_factors'],
            "time_analysis": reasoning['time_analysis'],
            "seasonal_analysis": reasoning['seasonal_analysis'],
            "infrastructure_analysis": reasoning['infrastructure_analysis'],
            "comparative_insights": reasoning['comparative_analysis'],
            "safety_recommendations": reasoning['mitigation_strategies']
        },
        "optimization_suggestion": {
            "should_reschedule": sorted_times[0][0] != tod,
            "recommended_time": sorted_times[0][0],
            "potential_risk_reduction_percent": round(
                float(risk_pct) - sorted_times[0][1]['risk_percent'], 2
            ),
            "urgency_level": "high" if float(risk_pct) - sorted_times[0][1]['risk_percent'] > 20 else 
                           "medium" if float(risk_pct) - sorted_times[0][1]['risk_percent'] > 10 else "low"
        }
    }

@api.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": model_loader.get_model() is not None
    }), 200

@api.route('/locations', methods=['GET'])
def get_locations():
    """Get available locations"""
    try:
        df = model_loader.get_reference_data()
        locations = sorted(list(set(
            df["Pickup_Location"].unique().tolist() + 
            df["Drop_Location"].unique().tolist()
        )))
        
        return jsonify({
            "status": "success",
            "total_locations": len(locations),
            "locations": locations
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500