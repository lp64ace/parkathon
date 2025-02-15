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