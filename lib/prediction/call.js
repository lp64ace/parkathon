async function parkingPrediction(coords, timestamp, weather, k=5) {
    const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coords, 
            timestamp, 
            weather,
            k
        })
    });
    const data = await response.json();
    data.forEach(spot => {
        console.log(`Chance spot ${spot.spotID} at ${spot.coords} is free: ${(spot.probability*100).toFixed(2)}%`);
    });
}

// example usage (find the 5 nearest parking spots given these coordinates, timestamp and weather)
// parkingPrediction('40.7128,-74.0060', '15-10-2023 14:00', 'Sunny 23C', 5);