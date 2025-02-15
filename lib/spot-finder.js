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
 *	for (let element of data.elements) {
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
 *	for (let element of data.elements) {
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
		const query = `[out:json];node(id:${node});way[highway](around:1000);out body geom;`;
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

export default {
	OpenStreetMapFetchRoads,
};
