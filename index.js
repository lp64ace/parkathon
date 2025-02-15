import express from 'express';
import parking from './lib/parking.js';

/*
const app = express();

app.get('/', (req, res) => {
	res.send('Hello from Dockerized Express!');
});

app.listen(3000, () => {
	console.log('Server running...');
});
*/

[146304012, 1833523007, 57554537].forEach((node) => {
	parking.OpenStreetMapFetchRoads(node, 1000).then((road) => {
		parking.OpenStreetNodeInfo(node).then((info) => {
			console.log(parking.GeographicDataToParkingSpaces(road).length, "spots in", info[0].tags.name);
		});
	});
});

console.log(await parking.OpenStreetNodeInfo(1833523007));
