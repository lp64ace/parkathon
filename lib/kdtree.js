class kDTree {
	constructor(dimensions = 2) {
		this.dimensions = dimensions;
		this.root = null;
	}
	
	/**
	 * Creates a new (unlinked) node, this function could be made static 
	 * if we pass the axis of the node instead of the depth!
	 *
	 * @typedef {Object} kDTreeNode
	 * @property {Array<kDTree.dimensions>} coords, The coordinates of the node in vector form.
	 * @property {kDTreeNode|null} l, The left (linked) node of the tree.
	 * @property {kDTreeNode|null} r, The right (linked) node of the tree.
	 * @property {number} a, The dimension/axis index for the specific node.
	 *
	 * @return {kDTreeNode} The newly created node for the tree.
	 */
	#CreateNode(point, depth) {
		return {
			coords: point,
			l: null,
			r: null,
			a: depth % this.dimensions,
		};
	}
	
	/**
	 * Same as `strcmp(stringA, stringB)` in C but for points!
	 */
	#CmpPoints(a, b) {
		for (let axis = 0; axis < this.dimensions; axis++) {
			if (Math.abs(a[axis] - b[axis]) > Number.EPSILON) {
				return a[axis] - b[axis];
			}
		}
		return 0;
	}
	
	#SquaredDistancePoints(a, b) {
		let result = 0;
		for (let axis = 0; axis < this.dimensions; axis++) {
			result += (a[axis] - b[axis]) ** 2;
		}
		return result;
	}
	
	/**
	 * https://www.geeksforgeeks.org/deletion-in-k-dimensional-tree/
	 */
	InsertPoint(point) {
		const InsertRecursive = (current, point, depth) => {
			if (current === null) {
				return this.#CreateNode(point, depth);
			}
			
			let axis = depth % this.dimensions;
			
			if (point[axis] < current.coords[axis]) {
				current.l = InsertRecursive(current.l, point, depth + 1);
			}
			else {
				current.r = InsertRecursive(current.r, point, depth + 1);
			}
			
			return current;
		};
		this.root = InsertRecursive(this.root, point, 0);
	}
	
	/**
	 * Helper function that will recursively search and find the minimum point of a given axis.
	 * https://www.geeksforgeeks.org/deletion-in-k-dimensional-tree/
	 */
	#FindMin(current, axis, depth) {
		if (current == null) {
			return null;
		}
		
		if (axis === (depth % this.dimensions)) {
			return current.l ? this.#FindMin(current.l, axis, depth + 1) : current;
		}
		
		let l = this.#FindMin(current.l, axis, depth + 1);
		let r = this.#FindMin(current.r, axis, depth + 1);
		
		let result = current;
		if (l && l.coords[axis] < result.coords[axis]) result = l;
		if (r && r.coords[axis] < result.coords[axis]) result = r;
		
		return result;
	}
	
	/**
	 * https://www.geeksforgeeks.org/deletion-in-k-dimensional-tree/
	 */
	RemovePoint(point) {
		const RemoveRecursive = (current, point, depth) => {
			if (current === null) {
				return null;
			}
			
			let axis = depth % this.dimensions;
			
			if (this.#CmpPoints(point, current.coords) == 0) {
				if (current.r !== null) {
					const other = this.#FindMin(current.r, axis, depth + 1);
					current.coords = other.coords;
					current.r = RemoveRecursive(current.r, other.coords, depth + 1);
				}
				else if (current.l !== null) {
					const other = this.#FindMin(current.l, axis, depth + 1);
					current.coords = other.coords;
					current.r = RemoveRecursive(current.l, other.coords, depth + 1);
					current.l = null;
				}
				else {
					return null;
				}
				
				return current;
			}
			
			if (point[axis] < current.coords[axis]) {
				current.l = RemoveRecursive(current.l, point, depth + 1);
			}
			else {
				current.r = RemoveRecursive(current.r, point, depth + 1);
			}
			
			return current;
		};
		
		this.root = RemoveRecursive(this.root, point, 0);
	}
	
	/**
	 * https://www.geeksforgeeks.org/deletion-in-k-dimensional-tree/
	 */
	Query(point, radius) {
		let result = [];
		
		const QueryRecursive = (current, depth, qpoint, qradius) => {
			if (current === null) {
				return null;
			}
			
			let axis = depth % this.dimensions;
			
			if (this.#SquaredDistancePoints(qpoint, current.coords) <= qradius * qradius) {
				result.push(current.coords);
			}
			
			if (qpoint[axis] - qradius <= current.coords[axis]) {
				QueryRecursive(current.l, depth + 1, qpoint, qradius);
			}
			if (qpoint[axis] + qradius >= current.coords[axis]) {
				QueryRecursive(current.r, depth + 1, qpoint, qradius);
			}
		};
		
		QueryRecursive(this.root, 0, point, radius);
		
		return result;
	}
};

module.exports = kDTree;
