const lines = require('fs').readFileSync('data18.txt').toString().trim().split('\n');

const pointsMap = new Map();
const neighboursMap = new Map();
const max = {
    x: -Infinity,
    y: -Infinity,
    z: -Infinity,
}
const min = {
    x: Infinity,
    y: Infinity,
    z: Infinity,
}

const parseName = (x, y, z) => [x, y, z].join('_');
const decodeName = (name) => name.split('_').map(v => +v);
const parseSideNames = (x, y, z) => {
    return [
        [x - 1, y, z],
        [x + 1, y, z],
        [x, y - 1, z],
        [x, y + 1, z],
        [x, y, z - 1],
        [x, y, z + 1],
    ].map(side => parseName(...side));
}

const updateExtremes = (x, y, z) => {
    if (x > max.x) {
        max.x = x;
    }
    if (x < min.x) {
        min.x = x;
    }
    if (y > max.y) {
        max.y = y;
    }
    if (y < min.y) {
        min.y = y;
    }
    if (z > max.z) {
        max.z = z;
    }
    if (z < min.z) {
        min.z = z;
    }

}

const makePoint = ([x, y, z]) => {
    let freeSides = 6;
    updateExtremes(x, y, z);
    const name = parseName(x, y, z);
    const sides = parseSideNames(x, y, z);
    sides.forEach(sideName => {
        if (pointsMap.has(sideName)) {
            freeSides -= 1;
            pointsMap.get(sideName).decrementFreeSides();
        }
        if (neighboursMap.has(sideName)) {
            neighboursMap.set(sideName, neighboursMap.get(sideName) + 1);
        } else {
            neighboursMap.set(sideName, 1);
        }
    });

    return {
        getFreeSides: () => freeSides,
        decrementFreeSides: () => freeSides -= 1,
        getName: () => name,
    }
}

lines.forEach(line => {
    const newPoint = makePoint(line.split(",").map(p => +p));
    const pointName = newPoint.getName();
    if (!pointsMap.has(pointName)) {
        pointsMap.set(pointName, newPoint)
    }
});

const canPointReachMax = (point) => {
    let sides = parseSideNames(...point);
    let reachedMax = false;
    const visited = new Set();
    while(sides.length > 0) {
        const side = sides.pop();
        if(visited.has(side)) continue;
        visited.add(side);
        if(pointsMap.has(side)) {
            continue; // blocked
        }

        const [x, y ,z] = decodeName(side);
        if(x >= max.x || x <= min.x || y >= max.y || y <= min.y || z >= max.z || z <= min.z) {
         //reached end
         reachedMax = true;
         break;
        } else {
            // move on
            const newSides = parseSideNames(x,y,z);
            sides = sides.concat(newSides);
        }
    }

    return reachedMax;
}

let totalFreeSides = 0;
for (const [name, point] of pointsMap) {
    totalFreeSides += point.getFreeSides();
    neighboursMap.delete(name);
}

console.log("task1 -> ", totalFreeSides);

for (const [name, sides] of neighboursMap) {
    const [x, y, z] = decodeName(name);
    const canReachMax = canPointReachMax([x,y,z]);
    if(!canReachMax) {
        totalFreeSides -= sides;
    }
}
console.log("task2 -> ", totalFreeSides);
