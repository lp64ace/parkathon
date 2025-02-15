import kDTree from './lib/kdtree.js';
import parking from './lib/parking.js';

class Cache {
    constructor() {
        this.tree = new kDTree(/* 2 */);
    }
    build(destination) {
        parking.OpenStreetMapFetchRoads(destination , 1000).then((road) => {
            parking.OpenStreetNodeInfo(destination ).then((info) => {
				if (info.length && info[0].tags) {
					const spots = parking.GeographicDataToParkingSpaces(road);
					/** Timestamp of cache should also be updated here. */
					this.tree.InsertPoints(spots);
					this.destiantion = destination;
					
					console.log(spots.length, "spots in", info[0].tags.name, "TK", info[0].tags['addr:postcode']);
				}
            });
        });
    }
    update() {
        /** Database query to remove spots that are currently occupied or insert spots that un-parked! */
    }
};

parking.OpenStreetMapFetchNodesNamed('Trilofos').then((data) => {
	data.forEach((place) => {
		if (place.osm_id) {
			const cache = new Cache();

			cache.build(place.osm_id);
			cache.update();
		}
	});
});
