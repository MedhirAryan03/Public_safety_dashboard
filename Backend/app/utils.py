# app/utils.py
import pandas as pd
import numpy as np
from datetime import datetime

def map_time_of_day(hr):
    """Map hour to time of day period"""
    if 5 <= hr < 12: 
        return "Morning"
    elif 12 <= hr < 17: 
        return "Afternoon"
    elif 17 <= hr < 21: 
        return "Evening"
    else: 
        return "Night"

def map_season(month):
    """Map month to season"""
    if month in [12, 1, 2]: 
        return "Winter"
    elif month in [3, 4, 5]: 
        return "Summer"
    elif month in [6, 7, 8, 9]: 
        return "Monsoon"
    else: 
        return "Post-Monsoon"

def validate_datetime(datetime_str):
    """Validate and parse datetime string"""
    formats = ["%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d"]
    
    for fmt in formats:
        try:
            dt = datetime.strptime(datetime_str, fmt)
            return True, dt
        except ValueError:
            continue
    
    return False, None

def validate_location(location, available_locations):
    """Check if location exists"""
    return location in available_locations

def build_model_input(pickup, drop, dt_str, model_loader):
    """Build input tensors for the model"""
    dt = pd.to_datetime(dt_str)
    
    # Get components
    df = model_loader.get_reference_data()
    config = model_loader.get_config()
    _, feature_scaler, label_encoders = model_loader.get_scalers()
    
    SEQ_LEN = config['SEQ_LEN']
    numeric_features = config['numeric_features']
    
    # Try to get route-specific sequence
    key = f"{pickup}||{drop}"
    route_data = df[df["Pickup_Location"] + "||" + df["Drop_Location"] == key]
    
    if len(route_data) >= SEQ_LEN:
        # Use route-specific data
        route_data = route_data.sort_values(by=df.columns[df.columns.str.contains('date|time', case=False)][0])
        seq = route_data[numeric_features].values[-SEQ_LEN:, :].astype("float32")
    else:
        # Fallback to global patterns
        seq = df[numeric_features].values[-SEQ_LEN:, :].astype("float32")
    
    # Encode categorical inputs
    pickup_id = np.array([
        label_encoders["Pickup_Location"].transform([pickup])[0] 
        if pickup in label_encoders["Pickup_Location"].classes_ 
        else 0
    ], dtype="int32")
    
    drop_id = np.array([
        label_encoders["Drop_Location"].transform([drop])[0] 
        if drop in label_encoders["Drop_Location"].classes_ 
        else 0
    ], dtype="int32")
    
    time_id = np.array([
        label_encoders["Time_of_Day"].transform([map_time_of_day(dt.hour)])[0]
    ], dtype="int32")
    
    season_id = np.array([
        label_encoders["Season"].transform([map_season(dt.month)])[0]
    ], dtype="int32")
    
    return (
        seq.reshape(1, SEQ_LEN, len(numeric_features)),
        pickup_id, 
        drop_id, 
        time_id, 
        season_id
    )

def get_infrastructure_data(pickup, drop, df):
    """Get infrastructure metrics for a route"""
    # Try route-specific first
    key = f"{pickup}||{drop}"
    route_data = df[df["Pickup_Location"] + "||" + df["Drop_Location"] == key]
    
    if len(route_data) > 0:
        return {
            'cctv': float(route_data["Nearby_CCTV_Cameras"].mean()),
            'response_time': float(route_data["Police_Response_Time_Minutes"].mean()),
            'stations': float(route_data["Num_Police_Stations_Nearby"].mean()),
            'count': int(len(route_data))
        }
    
    # Fallback to pickup location
    pickup_data = df[df["Pickup_Location"] == pickup]
    if len(pickup_data) > 0:
        return {
            'cctv': float(pickup_data["Nearby_CCTV_Cameras"].mean()),
            'response_time': float(pickup_data["Police_Response_Time_Minutes"].mean()),
            'stations': float(pickup_data["Num_Police_Stations_Nearby"].mean()),
            'count': int(len(pickup_data))
        }
    
    # Global fallback
    return {
        'cctv': float(df["Nearby_CCTV_Cameras"].mean()),
        'response_time': float(df["Police_Response_Time_Minutes"].mean()),
        'stations': float(df["Num_Police_Stations_Nearby"].mean()),
        'count': 0
    }