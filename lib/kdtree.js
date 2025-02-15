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
	 * Adds a new point to the tree.
	 * 
	 * @param {Array} An array/vector of numbers describing the point.
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
	
	InsertPoints(points) {
		for (let i = 0; i < points.length; i++) {
			this.InsertPoint(points[i]);
		}
	}
	
	/**
	 * Ensures a point is inside the tree.
	 * 
	 * @param {Array} An array/vector of numbers describing the point.
	 */
	EnsurePoint(point) {
		const EnsureRecursive = (current, point, depth) => {
			if (current === null) {
				return this.#CreateNode(point, depth);
			}
			if (this.#CmpPoints(point, current.coords) != 0) {
				let axis = depth % this.dimensions;
				
				if (point[axis] < current.coords[axis]) {
					current.l = EnsureRecursive(current.l, point, depth + 1);
				}
				else {
					current.r = EnsureRecursive(current.r, point, depth + 1);
				}
			}
			return current;
		};
		this.root = EnsureRecursive(this.root, point, 0);
	}
	
	EnsurePoints(points) {
		for (let i = 0; i < points.length; i++) {
			this.EnsurePoint(points[i]);
		}
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
	 * Remove an existing point from the tree.
	 * 
	 * @param {Array} An array/vector of numbers describing the point.
	 *
	 * https://www.geeksforgeeks.org/deletion-in-k-dimensional-tree/
	 */
	RemovePoint(point) {
		const RemoveRecursive = (current, point, depth) => {
			if (current === null || point === null) {
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
	 * Find all the points around another point in a radius.
	 * 
	 * @param {Array} An array/vector of numbers describing the point.
	 * @param {number} The radius we want to search around the point.
	 *
	 * @return {Array} An array of points that are within the radius.
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
