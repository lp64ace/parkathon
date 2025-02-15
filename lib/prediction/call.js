async function parkingPrediction(spotID, coords, timestamp, weather) {
    const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            spotID, 
            coords, 
            timestamp, 
            weather
        })
    });
    const data = await response.json();
    console.log(`Chance spot ${spotID} is free: ${(data.probability*100).toFixed(2)}%`);
}

// example usage
// parkingPrediction(1, '40.7128,-74.0060', '15-10-2023 14:00', 'Sunny 23C');