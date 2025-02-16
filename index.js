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

app.get('/tables', async (req, res) => {
	try {
		const connection = await mysql.createConnection(config);
		const [rows] = await connection.query('SHOW TABLES');
		res.json({ tables: rows.map(row => Object.values(row)[0]) });
		await connection.end();
	} catch (error) {
		console.error('MySQL error', error);
	}
});

app.listen(prt, () => console.log(`Backend running on port ${prt}`));
