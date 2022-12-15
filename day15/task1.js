const lines = require('fs').readFileSync('data15.txt').toString().trim().split('\n');

let maxX = -Infinity;
let maxY = -Infinity;
let minX = +Infinity;
let minY = +Infinity;
let maxDiffX = -Infinity;
let maxDiffY = -Infinity;

const devicePairs = lines.map(line => {
    const regex = /Sensor.+?x=(?<sensorX>[-\d]+)[^y]+?y=(?<sensorY>[-\d]+).+?x=(?<beaconX>[-\d]+)[^y]+?y=(?<beaconY>[-\d]+)/;
    const match = regex.exec(line);
    if (match) {
        const {beaconX, beaconY, sensorX, sensorY} = match.groups;
        maxX = Math.max(+beaconX, +sensorX, maxX);
        maxY = Math.max(+beaconY, +sensorY, maxY);
        minX = Math.min(+beaconX, +sensorX, minX);
        minY = Math.min(+beaconY, +sensorY, minY);
        const diffX = Math.abs(+beaconX - +sensorX);
        const diffY = Math.abs(+beaconY - +sensorY);
        maxDiffY = Math.max(maxDiffY, diffY);
        maxDiffX = Math.max(maxDiffX, diffX)
        return {
            beacon: {
                x: +beaconX,
                y: +beaconY,
            }, sensor: {
                x: +sensorX,
                y: +sensorY
            },
            diffY,
            diffX,
        }
    }
})

const zeroX = Math.abs(minX) + maxDiffX;
const zeroY = Math.abs(minY) + maxDiffY;
const searchY = 2000000 + zeroY;
const grid = Array.from({length: Math.abs(maxX) + Math.abs(minX) + 1 + maxDiffX * 2}).fill('.');

devicePairs.forEach(pair => {
    const {beacon, sensor, diffX, diffY} = pair;
    if ((beacon.y + zeroY) === searchY) {
        grid[beacon.x + zeroX] = 'B'
    }
    if ((sensor.y + zeroY) === searchY) {
        grid[sensor.x + zeroX] = 'S'
    }
    const diffTotal = diffX + diffY;

    if ((sensor.y + zeroY + diffTotal >= searchY) && (searchY >= sensor.y + zeroY)) {
        const rest = (diffTotal) - (searchY - (sensor.y + zeroY));
        for (let x = -rest; x <= rest; x++) {
            if (grid[sensor.x + x + zeroX] === '.') {
                grid[sensor.x + x + zeroX] = '#';
            }
        }
    } else if ((sensor.y + zeroY - diffTotal <= searchY) && (searchY <= sensor.y + zeroY)) {
        const rest = diffTotal - ((sensor.y + zeroY) - searchY);
        for (let x = -rest; x <= rest; x++) {
            if (grid[sensor.x + x + zeroX] === '.') {
                grid[sensor.x + x + zeroX] = '#';
            }
        }
    }
});

const task1 = grid.filter(x => x === '#').length;

console.log('task1 -> ', task1);
