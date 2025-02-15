import kDTree from './lib/kdtree.js';
import parking from './lib/parking.js';

class Cache {
    constructor() {
        this.tree = new kDTree(/* 2 */);
    }
    build(destination) {
        parking.OpenStreetMapFetchRoads(destination , 1000).then((road) => {
            parking.OpenStreetNodeInfo(destination ).then((info) => {
                const spots = parking.GeographicDataToParkingSpaces(road);
                /** Timestamp of cache should also be updated here. */
                this.tree.InsertPoints(spots);
                this.destiantion = destination;
				
				console.log(spots.length, "spots in", info[0].tags.name);
            });
        });
    }
    update() {
        /** Database query to remove spots that are currently occupied or insert spots that un-parked! */
    }
};

const destination = 146304012; // The Open Street Map node for the destination (Τρίλοφος).
const cache = new Cache();

cache.build(destination);
cache.update();
