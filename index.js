import kDTree from './lib/kdtree.js';
import parking from './lib/parking.js';

import express from "express";
import fetch from "node-fetch";
import mysql from 'mysql2/promise';

const prt = 9000;
const app = express();

const config = {
	host: 'localhost',
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
};

try {
	const connection = await mysql.createConnection(config);

	const [rows] = await connection.query('SHOW TABLES');
	rows.forEach(row => {
		console.log(Object.values(row)[0]);
	});
} catch (error) {
	console.error('MySQL error', error);
}

app.listen(prt, () => console.log(`Backend running on port ${prt}`));
