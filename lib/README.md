# Internal Library Utils (Parkathon)

The home directory for datastructures/algorithms and common API calls used by parkathon.

## KDTree

A (fast) tree representation of a point cloud that allows insert/deletion of points and queries to retrieve points in a radius of a target location
Usage is straighforward.

Construction, the constructor takes a single argument representing the dimensions of each point, 
points are stored as arrays of numbers and the metric that is used is the Euclidean metric.

```js
import kDTree from 'kdtree.js';
let tree = new kDTree(/* 2 */);
```

Insert/Remove point, inserting a point can be done using two methods the `InsertPoint` method and the `EnsurePoint` method, 
the later does not add a duplicate point if one is already in the tree!
Removing a point can be done in the same way we insert a point.

```js
import kDTree from 'kdtree.js';
let tree = new kDTree(/* 2 */);
tree.InsertPoint([2, 3]);
tree.RemovePoint([2, 3]);
```

Insert/Remove multiple points can be done using the helper functions `InsertPoints` and `EnsurePoints`.

```js
import kDTree from 'kdtree.js';
let tree = new kDTree(/* 2 */);
tree.InsertPoints([
	[2, 3],
	[5, 3],
	[2, 5],
	[8, 1],
]);
tree.EnsurePoints([
	[7, 3],
	[5, 3],
	[0, 5],
	[8, 1],
]);
```

Quering can be done using a single function call and specifying the target location and a radius, 
note that no assumption can be made of the order of the points that are returned.

```js
import kDTree from 'kdtree.js';
let tree = new kDTree(/* 2 */);
tree.InsertPoints(...);

let target = [5, 5];
let radius = 5;

tree.Query(target, radius).forEach((pt) => {
	console.log("Point", pt, "is within", radius, "meters of", target);
})
```
