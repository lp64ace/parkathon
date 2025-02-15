import fetch from 'node-fetch';

const url = "https://overpass-api.de/api/interpreter";

/**
 * Sends a POST request to the OpenStreetMap API to fetch information about roads 
 * within a 1km radius around a specified node.
 *
 * @param ${node} The wiki identifier for the region we want to extract data for, 
 *                Example would be '146304012' which points to Trilofos, Thessaloniki.
 *                Example would be '57554537' which points to Thessaloniki.
 * @return {Array} An array of elements, each describing a road within a 1km radius of the specified node. 
 *         Each element contains the following attributes:
 *           - `type`: Set to 'way', representing the road.
 *           - `tags`: A set of user-readable tags for the road, including the road's `name` (if available).
 *           - `geometry`: An array of coordinates representing the road's path, typically at each intersection.
 *
 * @example Iterating through every road that is returned from this function.
 * @code
 *	for (let element of result) {
 *		if (element.type === 'way' && element.nodes.length > 1) {
 *			console.log(`Road ${element.tags?.name || 'Unnamed Road'}`);
 *			for (let intersection of element.geometry) {
 *				console.log(`intersection (${intersection.lat}, ${intersection.lon})`);
 *			}
 *		}
 *	}
 * @endcode
 *
 * @example Iterating through every road but without caring about the intersections.
 * @code
 *	for (let element of result) {
 *		if (element.type === 'way' && element.nodes.length > 1) {
 *			let start = element.geometry[0];
 *			let end = element.geometry[element.geometry.length - 1];
 *		
 *			console.log(`Road ${element.tags?.name || 'Unnamed Road'}`);
 *			console.log(`from (${start.lat}, ${start.lon}) to (${end.lat}, ${start.lon})`);
 *		}
 *	}
 * @endcode
 */
const OpenStreetMapFetchRoads = (node) => {
	return new Promise((resolve, reject) => {
		const query = `[out:json];node(id:${node});way[highway](around:1000);out body geom tags;`;
		fetch(url, {
			method: 'POST',
			body: `data=${query}`
		}).then((response) => {
			if (!response.ok) {
				reject(`fetch failed`);
			}
			return response.json();
		}).then((data) => {
			/**
			 * A use case to extract latitude and longitude information for each road would be
			 *
			 * \code{.js}
			 *	for (let element of data.elements) {
			 *		if (element.type === 'way' && element.nodes.length > 1) {
			 *			let start = element.geometry[0];
			 *			let end = element.geometry[element.geometry.length - 1];
			 *		
			 *			console.log(`Road ${element.tags?.name || 'Unnamed Road'}`);
			 *			console.log(`from (${start.lat}, ${start.lon}) to (${end.lat}, ${start.lon})`);
			 *		}
			 *	}
			 * \endcode
			 * 
			 * You can also subdivide each road per intersection easily using the following method
			 *
			 * \code{.js}
			 *	for (let element of data.elements) {
			 *		if (element.type === 'way' && element.nodes.length > 1) {
			 *			console.log(`Road ${element.tags?.name || 'Unnamed Road'}`);
			 *			for (let intersection of element.geometry) {
			 *				console.log(`intersection (${intersection.lat}, ${intersection.lon})`);
			 *			}
			 *		}
			 *	}
			 * \endcode
			 */
			resolve(data.elements);
		}).catch((error) => {
			return reject(`fetch request failed, err: ${error}`);
		});
	});
}

/**
 * Implementation of the Mercator Projection, converting the latitude and longitude 
 * coordinates to Euclidean space (in meters).
 * 
 * Output from this function can be directly used for a kDTree.
 * Beware that the Earth is spherical and can wrap around!
 */
const GeographicToEuclidean = (geo) => {
	const latRad = toRadians(geo.lat);
    const lonRad = toRadians(geo.lon);
	
	const x = lonRad * 12756000;
    const y = Math.log(Math.tan(Math.PI / 4 + latRad / 2)) * 12714000;
	
	return [x, y];
}

/**
 * Implementation of the Mercator Projection, converting the latitude and longitude 
 * coordinates to Euclidean space (in meters), this function will return 3 points, 
 * wraping around the earth.
 * 
 * Output from this function can be directly used for a kDTree.
 * Beware that the Earth is spherical and can wrap around!
 * @code
 *	for (let element of result) {
 *		if (element.type === 'way' && element.nodes.length > 1) {
 *			for (let intersection of element.geometry) {
 *				kdtree.InsertPoints(GeographicToEuclideanSafe(intersection));
 *			}
 *		}
 *	}
 * @endcode
 */
const GeographicToEuclideanSafe = (geo) => {
	return [
		GeographicToEuclidean({
			lan : geo.lan,
			lon : geo.lon - 360,
		}),
		GeographicToEuclidean({
			lan : geo.lan,
			lon : geo.lon,
		}),
		GeographicToEuclidean({
			lan : geo.lan,
			lon : geo.lon + 360,
		})
	];
};

const ParkingRoadFactor = (type) => {
	switch (type) {
		case 'parallel': return 1;
		case 'perpendicular': return 2;
		case 'diagonal': return 1.5;
	}
	return 0;
};

/**
 * After retrieving all the latest data from #OpenStreetMapFetchRoads this function 
 * returns the parking spaces for each road, taking into consideration law limiations. 
 * NOTE: It would be nice to visualize these results but not for the user to view!
 * 
 * @param {Array} Information regarding roads, fetched from open street map.
 *
 * @return {Array} An array of 2 dimensional Euclidean points in space, 
 * each point representing a parking space.
 */
const GeographicDataToParkingSpaces = (data) => {
	let result = [];
	
	for (let element of data) {
		if (element.type === 'way' && element.nodes && element.nodes.length > 1) {
			const mult = 2;
			
			if (['motorway', 'trunk', 'primary'].includes(element.tags?.highway)) {
				continue;
			}
			
			const tags = element.tags || {};
			const keys = Object.keys(road.tags).filter(tag => tag.startsWith('parking'));
			if (parking.length > 0) {
				mult = 0;
				
				if (tags['parking:lane:left']) {
					mult += ParkingRoadFactor(parkingTags['parking:lane:left']);
				}
				if (tags['parking:lane:right']) {
					mult += ParkingRoadFactor(parkingTags['parking:lane:right']);
				}
				if (tags['parking:lane:both']) {
					mult += ParkingRoadFactor(parkingTags['parking:lane:both']) * 2;
				}
			}
			
			if (tags['oneway'] === 'yes') {
				mult = Math.min(mult, 1);
			}
			
			const lanes = parseInt(parkingTags['lanes']) || 2;
			if (lanes >= 4) {
				mult = Math.max(mult - 1, 0);
			}
			
			if (mult <= 0) {
				continue;
			}
			
			for (let i = 1; i < element.geometry.length; i++) {
				const a = GeographicToEuclidean(element.geometry[i - 1]);
				const b = GeographicToEuclidean(element.geometry[i - 0]);
				const length = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
				/**
				 * Average size of a car is 4.9m, we add 0.2m for padding, 
				 * we are also not allowed to park closer than 10m to each intersection!
				 */
				const totalp = (length - 20) * mult / (4.9 + 0.2);
				
				for (let j = 1; j <= totalp; j++) {
					/**
					 * We make it so that we never add parking spaces to the edge of the road.
					 */
					const t = j / (totalp + 1);
					
					result.push([
						a[0] * t + b[0] * (1 - t),
						a[1] * t + b[1] * (1 - t),
					]);
				}
			}
		}
	}
	
	return result;
};

export default {
	OpenStreetMapFetchRoads,
	GeographicToEuclidean,
	GeographicToEuclideanSafe,
	GeographicDataToParkingSpaces,
};
