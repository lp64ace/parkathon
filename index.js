import kDTree from './lib/kdtree.js';
import parking from './lib/parking.js';

import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/api/maps", async (req, res) => {
	const { lat, lon, place } = req.query;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?${new URLSearchParams({
        key: process.env.VITE_GOOGLE_MAPS_API_KEY,
        address: `${lat},${lon}`,
    })}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching Google Maps API:", error);
        res.status(500).json({ error: "Failed to fetch Google Maps data" });
    }
});

app.listen(9000, () => console.log(`Backend running on port ${PORT}`));
