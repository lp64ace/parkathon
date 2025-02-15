import express from 'express';
import openmap from './lib/spot-finder.js';

const app = express();

app.get('/', (req, res) => {
	res.send('Hello from Dockerized Express!');
});

app.listen(80, () => {
	console.log('Server running...');
});

openmap.OpenStreetMapFetchRoads('146304012');
