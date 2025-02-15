from flask import Flask, request, jsonify
from model import train_model, parkingChance
from preprocessing import fetch, preprocess, add_features

app = Flask(__name__)

# this should be done ONCE, not on every request
model = train_model()

@app.route('/predict', methods=['POST'])
def predict():

    data = request.get_json()
    spotID    = data['spotID']
    coords    = data['coords']
    timestamp = data['timestamp']
    weather   = data['weather']
    
    df = fetch(spotID)  # fetch data ONCE (!)
    df = preprocess(df)
    df = add_features(df)

    probability = parkingChance(model, df, spotID, coords, timestamp, weather)
    return jsonify({'probability': probability})

if __name__ == '__main__':
    app.run(debug=True)