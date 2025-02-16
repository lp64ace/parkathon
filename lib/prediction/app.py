from flask import Flask, request, jsonify
from kdtree import kDTree
from db import fetch, fetch_all
from preprocessing import preprocess, add_features
from model import train_model, parkingChance

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():

    data = request.get_json()
    destination = data['coords']
    timestamp   = data['timestamp']
    weather     = data['weather']
    k           = data.get('k', 5)  # default to 5 nearest spots

    tree = kDTree(dimensions=2)
    all_spots = fetch_all()
    all_spots_coords = all_spots[['long', 'lat']].values
    tree.InsertPoints(all_spots_coords)
    lon, lat = map(float, destination.split(','))
    nearest_spots = tree.Query([lon, lat], k)

    results = []
    for spot in nearest_spots:

        spot_lon, spot_lat = spot
        model = train_model(spot_lon, spot_lat)  # train a model for each spot
        probability = parkingChance(model, timestamp, weather)
        results.append({'coords': f"{spot_lon},{spot_lat}", 'probability': probability})

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)