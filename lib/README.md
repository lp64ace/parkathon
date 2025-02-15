# Internal Library Utils (Parkathon)

The home directory for datastructures/algorithms and common API calls used by parkathon.

## KDTree

A fast tree structure for point clouds, supporting point insertion, deletion, and radius-based queries. The tree stores points as arrays of numbers using the Euclidean distance metric.

### Construction

To create a KDTree, specify the dimensionality of the points:

```js
import kDTree from 'kdtree.js';
let tree = new kDTree(/* 2 */);
```

### Insert/Remove

* InsertPoint: Inserts a new point to the tree, does not take duplicates into account!
* EnsurePoint: Inserts a new point to the tree (if there is no other point with the same coordinates)!
* RemovePoint: Removes a point from the tree if the point was in the tree!

```js
tree.InsertPoint([2, 3]);
tree.RemovePoint([2, 3]);
```

### Insert/Remove Multiple

* InsertPoints/EnsurePoints: Insert multiple points (stored in an array) in the tree!

```js
tree.InsertPoints([[2, 3], [5, 3], [2, 5], [8, 1]]);
tree.EnsurePoints([[7, 3], [5, 3], [0, 5], [8, 1]]);
```

### Querying

To query points within a given radius, use the `Query` method with a target location and a radius. The order of the results is not guaranteed.

```js
let target = [5, 5];
let radius = 5;

tree.Query(target, radius).forEach((pt) => {
	console.log("Point", pt, "is within", radius, "meters of", target);
})
```

## Parking

### Geographical Information

Simple queries regarding the roads and geometrical elements of a region can be retrieved using the following functions:

* OpenStreetMapFetchRoads: Fetches roads and geometrical data within a specified radius around a region.
	- params
		- `node` | The ID of the region or node for which to request information.
		- `radius` | The search radius in meters.
	- return
		- An array of elements with the following attributes:
			`.geometry` | An array of {lat, lon} objects representing the latitude and longitude of each road vertex.
			`.tags` | A set of user-readable tags, such as the road's name, lane information, and parking restrictions.
			`.nodes` | A list of adjacent nodes for each road element.

```js
import parking from './lib/parking.js';

parking.OpenStreetMapFetchRoads(57554537 /* Thessaloniki */ , 1000).then((roads) => {
	console.log(roads);
});
```

* OpenStreetNodeInfo: A simpler version of OpenStreetMapFetchRoads that only returns the tags.
	- params
		- `node` | The ID of the region or node for which to request information.
	- return 
		- An array of elements with the following attributes:
			`.tags` | A set of user-readable tags, such as the road's name, lane information, and parking restrictions.

```js
import parking from './lib/parking.js';

parking.OpenStreetNodeInfo(57554537 /* Thessaloniki */).then((info) => {
	console.log(info); /* `info[0].tags.name` Should contain the name of the node if applicable! */
});
```

* OpenStreetMapFetchNodesNamed: Returns a list of places with the specified name.
	- params
		- `name` | The name of the place we want to search
	- return
		- An array of places that match the name search query, with the following attributes:
			`.name` | User readable name (e.g. 'Περαία').
			`.display_name` | Full user readable name, in context (e.g. 'Περαία, Thermaikos Municipality, Thessaloniki Regional Unit, Central Macedonia, Macedonia and Thrace, 570 19, Greece').
			`.osm_id` | (When applicable) The OpenStreeMap node id (can be used with the rest of the OpenStreetMap functions).
			`.addresstype` | The type of the place (village/city/etc.).

```js
parking.OpenStreetMapFetchNodesNamed('Trilofos').then((data) => {
	data.forEach((place) => {
		console.log(place.display_name);
	});
});
```

Parking spot calculation in a region can be done using the `GeographicDataToParkingSpaces`.
It expects data from the `OpenStreetMapFetchRoads` method and return an array of available parking spots.

Each parking spot is represented by four numbers.

 * [0] Also known as the 'x' coordinate in a 2D plane when projecting the map of the parking spot.
 * [1] Also known as the 'y' coordinate in a 2D plane when projecting the map of the parking spot.
 * [2] The 'lon' representing the longitude of the parking spot.
 * [3] The 'lat' representing the latitude of the parking spot.

```js
parking.OpenStreetMapFetchRoads(57554537 /* Thessaloniki */, 1000).then((road) => {
	parking.OpenStreetNodeInfo(57554537 /* Thessaloniki */).then((info) => {
		const spots = parking.GeographicDataToParkingSpaces(road);
		console.log(spots.length, "spots in", info[0].tags.name);
	});
});
```