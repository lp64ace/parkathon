import kDTree from '../lib/kdtree.js';

describe("kDTree Basic", () => {
	let tree;
	
	beforeEach(() => {
        tree = new kDTree();
    });
	
	test("should create an empty tree", () => {
        expect(tree.root).toBeNull();
    });
	
	test("should insert a point", () => {
        tree.InsertPoint([2, 3]);
        expect(tree.root).not.toBeNull();
    });
	
	test("should remove a point", () => {
        tree.InsertPoint([5, 10]);
        tree.RemovePoint([5, 10]);
        expect(tree.root).toBeNull();
    });
	
	test("should find nearest point within radius", () => {
        tree.InsertPoint([5, 5]);
        tree.InsertPoint([10, 10]);
        const result = tree.Query([6, 6], 2);
        expect(result.length).toBeGreaterThan(0);
    });
});

/**
 * Same as `strcmp(stringA, stringB)` in C but for points!
 */
function CmpPoints(a, b) {
	for (let axis = 0; axis < 2; axis++) {
		if (Math.abs(a[axis] - b[axis]) > Number.EPSILON) {
			return a[axis] - b[axis];
		}
	}
	return 0;
}

/**
 * Same as `dot(pointA, pointB)` in GLSL!
 */
function SquaredDistancePoints(a, b) {
	let result = 0;
	for (let axis = 0; axis < 2; axis++) {
		result += (a[axis] - b[axis]) ** 2;
	}
	return result;
}

function QueryBruteForce (points, point, radius) {
	let result = [];
	
	for (let pt of points) {
		if (SquaredDistancePoints(pt, point) <= radius * radius) {
			result.push(pt);
		}
	}
	
	return result;
};

describe("kDTree Advanced", () => {
	const base = [
		[ 3,  6],
		[17, 15],
		[13, 15],
		[ 6, 12],
		[ 9,  1],
		[ 2,  7],
		[10, 19]
	];
	
	let tree;
	
	beforeEach(() => {
        tree = new kDTree();
		
		for (let pt of base) {
			tree.InsertPoint(pt);
		}
    });
	
	test("testcase #1", () => {
        for (let pt of base) {
			expect(tree.Query(pt, 0)).toEqual([pt]);
		}
    });
	
	test("testcase #2/1", () => {
		const rm = base[2];
		
		tree.RemovePoint(rm);
		
        for (let pt of base) {
			if (CmpPoints(pt, rm)) {
				expect(tree.Query(pt, 0)).toEqual([pt]);
			}
			else {
				expect(tree.Query(pt, 0)).toEqual([]);
			}
		}
    });
	
	test("testcase #2/2", () => {
		const rm = base[4];
		
		tree.RemovePoint(rm);
		
        for (let pt of base) {
			if (CmpPoints(pt, rm)) {
				expect(tree.Query(pt, 0)).toEqual([pt]);
			}
			else {
				expect(tree.Query(pt, 0)).toEqual([]);
			}
		}
    });
	
	test("testcase #2/3", () => {
		const rm = base[6];
		
		tree.RemovePoint(rm);
		
        for (let pt of base) {
			if (CmpPoints(pt, rm)) {
				expect(tree.Query(pt, 0)).toEqual([pt]);
			}
			else {
				expect(tree.Query(pt, 0)).toEqual([]);
			}
		}
    });
	
	test("testcase #3", () => {		
		const point = [5, 5];
		
		for (let radius = 1; radius <= 32; radius++) {
			expect(tree.Query(point, radius).sort()).toEqual(QueryBruteForce(base, point, radius).sort());
		}
    });
	
	test("testcase #4/1", () => {
		const rm_idx = 2;
		const rm_val = base[rm_idx];
		let updated = base.slice(0, rm_idx).concat(base.slice(rm_idx + 1));
		
		tree.RemovePoint(rm_val);
		
		const point = [5, 5];
		
		for (let radius = 1; radius <= 32; radius++) {
			expect(tree.Query(point, radius).sort()).toEqual(QueryBruteForce(updated, point, radius).sort());
		}
    });
	
	test("testcase #4/2", () => {
		const rm_idx = 4;
		const rm_val = base[rm_idx];
		let updated = base.slice(0, rm_idx).concat(base.slice(rm_idx + 1));
		
		tree.RemovePoint(rm_val);
		
		const point = [5, 5];
		
		for (let radius = 1; radius <= 32; radius++) {
			expect(tree.Query(point, radius).sort()).toEqual(QueryBruteForce(updated, point, radius).sort());
		}
    });
	
	test("testcase #4/3", () => {
		const rm_idx = 6;
		const rm_val = base[rm_idx];
		let updated = base.slice(0, rm_idx).concat(base.slice(rm_idx + 1));
		
		tree.RemovePoint(rm_val);
		
		const point = [5, 5];
		
		for (let radius = 1; radius <= 32; radius++) {
			expect(tree.Query(point, radius).sort()).toEqual(QueryBruteForce(updated, point, radius).sort());
		}
    });
});

describe("kDTree Random", () => {
	test("testcase #1", () => {
		let tree = new kDTree();
		
		let points = [];
		for (let i = 0; i < 10; i++) {
			points.push([Math.random() * 100, Math.random() * 100]);
		}
		tree.InsertPoints(points);
		for (let i = 0; i < 3; i++) {
			const rm_idx = Math.max(Math.floor(Math.random() * points.length - 1), 0);
			tree.RemovePoint(points[rm_idx]);
			points = points.slice(0, rm_idx).concat(points.slice(rm_idx + 1));
		}
		
		const point = [Math.random() * 100, Math.random() * 100];
		
		for (let radius = 1; radius <= 10; radius++) {
			expect(tree.Query(point, radius).sort()).toEqual(QueryBruteForce(points, point, radius).sort());
		}
    });
	
	test("testcase #2", () => {
		let tree = new kDTree();
		
		let points = [];
		for (let i = 0; i < 100; i++) {
			points.push([Math.random() * 100, Math.random() * 100]);
		}
		tree.InsertPoints(points);
		for (let i = 0; i < 33; i++) {
			const rm_idx = Math.max(Math.floor(Math.random() * points.length - 1), 0);
			
			tree.RemovePoint(points[rm_idx]);
			points = points.slice(0, rm_idx).concat(points.slice(rm_idx + 1));
		}
		
		const point = [Math.random() * 100, Math.random() * 100];
		
		for (let radius = 1; radius <= 100; radius++) {
			expect(tree.Query(point, radius).sort()).toEqual(QueryBruteForce(points, point, radius).sort());
		}
    });
});
