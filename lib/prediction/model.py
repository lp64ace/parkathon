import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from preprocessing import fetch_data, preprocess_data, add_features
from datetime import datetime

def train_model(spotID):
    
    df = fetch(spotID)
    df = preprocess(df)
    df = add_features(df)

    X = df[['latitude', 'longitude', 'conditions', 'temperature', 'availability', 'isWeekend', 'isHoliday', 'season', 'year', 'day', 'hour']]
    y = df['isFree']
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    return model

def parkingChance(model, df, spotID, coords, timestamp, weather):

    latitude, longitude = map(float, coords.split(','))
    datetime_obj = datetime.strptime(timestamp, '%d-%m-%Y %H:%M')
    conditions, temperature = weather.split()
    conditions_encoded = df['conditions'].cat.categories.get_loc(conditions) if conditions in df['conditions'].cat.categories else -1
    if temperature.endswith('F'):
        # Convert to Celsius
        temperature = (int(temperature[:-1])-32) * 5.0/9.0  
    else:
        # Remove 'C'
        temperature = int(temperature[:-1])  

    input_df = pd.DataFrame([{
        'latitude': latitude,
        'longitude': longitude,
        'conditions': conditions_encoded,
        'temperature': temperature,
        'availability': df['availability'].iloc[-1],  # Use last availability data
        'isWeekend': datetime_obj.weekday() >= 5,
        'isHoliday': datetime_obj in holidays.GR(),
        'season': datetime_obj.month % 12 // 3 + 1,
        'year': datetime_obj.year,
        'day': datetime_obj.weekday(),
        'hour': datetime_obj.hour
    }])

    probability = model.predict_proba(input_df)[:, 1][0]
    return probability