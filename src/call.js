async function parkingPrediction(lat, lon, timestamp, weather, radius=50) {
    const response = await fetch('http://localhost:9001/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            lat,
            lon, 
            timestamp, 
            weather,
            radius
        })
    });
    const data = await response.json();
    data.forEach(spot => {
        console.log(`Chance spot ${spot.spotID} at ${spot.coords} is free: ${(spot.probability*100).toFixed(2)}%`);
    });
}

/* EXAMPLE USAGE: 
 * parkingPrediction('40.7128', '-74.0060', '2023-10-15T14:00:00', 'Sunny 23C', 50);
 * Finds the all the available parking spots in given radius with the above coordinates, timestamp and weather.
 * Returns a list of spots ([lat,lon] pairs) with their respective probabilities of being free. 
 */