import kDTree from './lib/kdtree.js';
import parking from './lib/parking.js';

import express from "express";
import fetch from "node-fetch";
import mysql from 'mysql2/promise';

const prt = 9000;
const app = express();

const config = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
};

app.get('/user/login', async (req, res) => {
	
});

app.get('/user/signup', async (req, res) => {
	
});

app.get('/park/list/active', async (req, res) => {
	let {
		user,
	} = req.query;
	
	if (!user /* or user not in database */) {
		return res.status(400).json({ error: "Invalid user id provided" });
	}
	
	try {
		const conn = await mysql.createConnection(config);
		const [rows] = await conn.query(`SELECT * FROM parking WHERE user_id = ${user} AND end_time IS NULL;`);
		await conn.end();
		
		return res.json(rows);
	} catch (error) {
		return res.status(500).json({ error: "Failed to register parking spot occupation" });
	}
});

app.get('/park/list/all', async (req, res) => {
	let {
		user,
	} = req.query;
	
	if (!user /* or user not in database */) {
		return res.status(400).json({ error: "Invalid user id provided" });
	}
	
	try {
		const conn = await mysql.createConnection(config);
		const [rows] = await conn.query(`SELECT * FROM parking WHERE user_id = ${user};`);
		await conn.end();
		
		return res.json(rows);
	} catch (error) {
		return res.status(500).json({ error: "Failed to register parking spot occupation" });
	}
});

app.get('/park/occupy', async (req, res) => {
	let {
		user,
		lat,
		lon,
	} = req.query;
	
	if (!lat || !lon) {
		return res.status(400).json({ error: "Latitude and longitude are required" });
	}
	if (!user /* or user not in database */) {
		return res.status(400).json({ error: "Invalid user id provided" });
	}
	
	try {
		const conn = await mysql.createConnection(config);
		const q = 'INSERT INTO parking (user_id, lat, lon) VALUES (?, ?, ?)';
        const v = [user, lat, lon];
		
		const [results] = await conn.execute(q, v);
		
		res.json(results);
		
		await conn.end();
	} catch (error) {
		return res.status(500).json({ error: "Failed to register parking spot occupation" });
	}
});

app.get('/park/vacay', async (req, res) => {
	let {
		parking,
		user,
	} = req.query;
	
	if (!parking /* or parking not in database */) {
		return res.status(400).json({ error: "Invalid parking id provided" });
	}
	if (!user /* or user not in database */) {
		return res.status(400).json({ error: "Invalid user id provided" });
	}
	
	try {
		const conn = await mysql.createConnection(config);
		const q = 'UPDATE parking SET end_time = NOW() WHERE parking_id = ? AND user_id = ? AND end_time IS NULL';
        const v = [parking, user];
		
		const [results] = await conn.execute(q, v);
		
		res.json(results);
		
		await conn.end();
	} catch (error) {
		return res.status(500).json({ error: "Failed to register parking spot occupation" });
	}
});

app.get('/park/find', async (req, res) => {
	let {
		lat,
		lon,
		rad,
	} = req.query;
	
	if (!lat || !lon) {
		return res.status(400).json({ error: "Latitude and longitude are required" });
	}
	
	rad = rad || 50; // By default the radius is 50m
	
	try {
		const tree = new kDTree();
		const conn = await mysql.createConnection(config);
		const data = await parking.OpenStreetMapFetchRoadsAt(lat, lon, rad);
		const spot = parking.GeographicDataToParkingSpaces(data);
		
		tree.InsertPoints(spot);
		
		const [rows] = await conn.query('SELECT * FROM parking WHERE start_time <= NOW() AND end_time IS NULL;');
		rows.forEach((entry) => {
			/** Remove the nearest parking spot in a radius of 12m (the distance of two cars). */
			tree.RemoveNearest(parking.GeographicToEuclidean({
				lat: entry.lat,
				lon: entry.lon,
			}), 12);
		});
		await conn.end();
		
		return res.json(tree.Query(parking.GeographicToEuclidean({
				lat: lat,
				lon: lon,
		}), rad));
	} catch (error) {
		return res.status(500).json({ error: "Failed to fetch parking information near location" });
	}
});

app.get('/park/simulate', async (req, res) => {
	let {
		lat,
		lon,
		rad,
	} = req.query;
	
	if (!lat || !lon) {
		return res.status(400).json({ error: "Latitude and longitude are required" });
	}
	
	rad = rad || 1000; // By default the radius is 1km
	
	const RandomWithinRadius = (in_lat, in_lon, in_rad) => {
		const R_lat = (in_rad / 111320); // 1 degree ≈ 111.32 km
		const R_lon = (in_rad / (111320 * Math.cos(in_lat * (Math.PI / 180))));
		return {
			lat: in_lat + (Math.random() - 0.5) * R_lat * 2,
			lon: in_lon + (Math.random() - 0.5) * R_lon * 2,
		};
	};
	
	try {
		const conn = await mysql.createConnection(config);
		const data = await parking.OpenStreetMapFetchRoadsAt(lat, lon, rad);
		const spot = parking.GeographicDataToParkingSpaces(data);
		
		const fake = [];
		const user = 1;
		
		/**
		 * Some people might end up parking on the sea... that shouldn't really be a problem though!
		 */
		for (let i = 0; i < spot.length * 0.9; i++) {
			const { x, y } = RandomWithinRadius(lat, lon, rad);
			const [result] = await conn.execute(
				'INSERT INTO parking (user_id, lat, lon) VALUES (?, ?, ?)',
				[user, lat, lon]
			);
			fake.push(result.insertId);
		}
		
		/** Less than 10% of the occupied parking spots will be released! */
		const free = Math.floor(fake.length * Math.random() * 0.1);
		
		for (let i = 0; i < fake.length * free; i++) {
			const id = fake[Math.floor(Math.random() * fake.length)];
			await connection.execute(
				'UPDATE parking SET end_time = NOW() WHERE parking_id = ? AND user_id = ? AND end_time IS NULL',
				[id, user]
			);
		}
		
		await conn.end();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Failed to simulate parking near location" });
	}
});

app.listen(prt, () => console.log(`Backend running on port ${prt}`));
