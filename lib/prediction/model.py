import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from preprocessing import fetch, preprocess, add_features
from datetime import datetime
import holidays

def train_model(spot_lon, spot_lat):
    df = fetch(spot_lon, spot_lat)
    df = preprocess(df)
    df = add_features(df)

    X = df[['latitude', 'longitude', 'conditions', 'temperature', 'availability', 'isWeekend', 'isHoliday', 'season', 'year', 'day', 'hour']]
    y = df['isFree']

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    return model

def parkingChance(model, spotID, coords, timestamp, weather):

    latitude, longitude = map(float, coords.split(','))
    datetime_obj = datetime.strptime(timestamp, '%d-%m-%Y %H:%M')
    conditions, temperature = weather.split()
    conditions_encoded = model.classes_.tolist().index(conditions) if conditions in model.classes_ else -1
    if temperature.endswith('F'):
        # Convert to Celsius
        temperature = (int(temperature[:-1])-32) * 5.0/9.0  
    else:
        # Remove 'C'
        temperature = int(temperature[:-1])  

    input_df = pd.DataFrame([{
        'latitude':     latitude,
        'longitude':    longitude,
        'conditions':   conditions_encoded,
        'temperature':  temperature,
        'availability': availability,
        'isWeekend':    datetime_obj.weekday() >= 5,
        'isHoliday':    datetime_obj in holidays.GR(),
        'season':       datetime_obj.month % 12 // 3 + 1,
        'year':         datetime_obj.year,
        'day':          datetime_obj.weekday(),
        'hour':         datetime_obj.hour
    }])

    probability = model.predict_proba(input_df)[:, 1][0]
    return probability