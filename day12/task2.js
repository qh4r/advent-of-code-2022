const input = require('fs').readFileSync('data12.txt').toString().trim().split('\n');
const nodes = []
let start = [0, 0];
let end = [0, 0];
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const weights = alphabet.split('').reduce((out, x, i) => {
    out[x] = i + 1;
    return out;
}, {})
input.map((line, i) => {
    nodes[i] = [];
    line.split('').map((node, j) => {
        if (node === 'S') {
            end = [i, j]
            nodes[i][j] = weights['a'];
        } else if (node === 'E') {
            start = [i, j]
            nodes[i][j] = weights['z'];
        } else {
            nodes[i][j] = weights[node];
        }
    })
});
const makeName = (location) => `${location[0]}_${location[1]}`;

const canTraverseToLocation = (location, diffI, diffJ) => {
    const source = nodes[location.i][location.j];
    const target = nodes[location.i + diffI] ? nodes[location.i + diffI][location.j + diffJ] : null;
    return (target && ((Math.abs(target - source) < 2) || target > source)) ? [location.i + diffI, location.j + diffJ] : null;
}

const makeWaypoint = (location, past = new Set()) => ({
    name: makeName(location),
    location: {i: location[0], j: location[1]},
    past,
})

const roads = [makeWaypoint(start)];
let top = Number.MAX_SAFE_INTEGER;
const visited = new Set()
const movePermutations = [[0, 1], [0, -1], [1, 0], [-1, 0]]
while (roads[0] && roads[0].past.size < top) {
    const waypoint = roads.shift();
    if (visited.has(waypoint.name)) {
        continue;
    }
    visited.add(waypoint.name);
    movePermutations.map(move => {
        const target = canTraverseToLocation(waypoint.location, move[0], move[1]);
        if (target) {
            if (nodes[target[0]][target[1]] === weights['a'] && (waypoint.past.size + 1 < top)) {
                top = waypoint.past.size + 1;
            }
            const newWaypoint = makeWaypoint(target, new Set([...waypoint.past, waypoint.name]));
            roads.push(newWaypoint);
        }
    })
}

console.log('task2 -> ', top);
