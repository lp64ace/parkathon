import express from 'express';
import parking from './lib/parking.js';

const app = express();

app.get('/', (req, res) => {
	res.send('Hello from Dockerized Express!');
});

app.listen(3000, () => {
	console.log('Server running...');
});

parking.OpenStreetMapFetchRoads('146304012').then((data) => {
	parking.GeographicDataToParkingSpaces(data, 1000);
});
