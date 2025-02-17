import requests
from flask import Flask, request, jsonify
from db import fetch
from preprocessing import preprocess, add_features
from model import train_model, parkingChance

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():

    data = request.get_json()
    destination = data['coords']
    timestamp   = data['timestamp']
    weather     = data['weather']
    radius      = data.get('k', 50)  # default to 50 meters

    # POST request to the /park/find endpoint
    lat, lon = map(float, destination.split(','))
    response = requests.post('http://localhost:9001/park/find', json={
        'lat': lat,
        'lon': lon,
        'rad': radius
    })

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch parking spots'}), 500

    nearest_spots = response.json()

    results = []
    for spot in nearest_spots:

        spot_lon = spot['lon']
        spot_lat = spot['lat']
        model = train_model(spot_lon, spot_lat)  # train a model for each spot
        probability = parkingChance(model, timestamp, weather)
        results.append({'coords': f"{spot_lon},{spot_lat}", 'probability': probability})

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)