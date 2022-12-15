const lines = require('fs').readFileSync('data15.txt').toString().trim().split('\n');

let topLimit = 4000000;

const lineInScope = (sensorY, diffTotal, y) => (sensorY + diffTotal >= y) && (sensorY - diffTotal <= y)

const devicePairs = lines.map(line => {
    const regex = /Sensor.+?x=(?<sensorX>[-\d]+)[^y]+?y=(?<sensorY>[-\d]+).+?x=(?<beaconX>[-\d]+)[^y]+?y=(?<beaconY>[-\d]+)/;
    const match = regex.exec(line);
    if (match) {
        const {beaconX, beaconY, sensorX, sensorY} = match.groups;
        const diffX = Math.abs(+beaconX - +sensorX);
        const diffY = Math.abs(+beaconY - +sensorY);
        const diffTotal = diffX + diffY;
        return {
            beacon: {
                x: +beaconX,
                y: +beaconY,
            },
            sensor: {
                x: +sensorX,
                y: +sensorY
            },
            diffY,
            diffX,
            diffTotal,
        }
    }
})

let res;

for (let y = 0; y < topLimit; y++) {
    const spans = [];
    devicePairs.forEach(pair => {
        if(lineInScope(pair.sensor.y, pair.diffTotal, y)) {
            const restDiff = pair.diffTotal - Math.abs(pair.sensor.y - y);
            spans.push({
                start: Math.max(0, pair.sensor.x - restDiff),
                end: Math.min(topLimit, pair.sensor.x + restDiff),
            })
        }
    })
    spans.sort((span1, span2) => span1.start - span2.start);
    while(spans.length > 1){
        const currentSpan = spans.shift();
        const nextSpan = spans.shift();
        if(currentSpan.end + 1 >= nextSpan.start) {
            spans.unshift({
                start: Math.min(currentSpan.start, nextSpan.start),
                end: Math.max(currentSpan.end, nextSpan.end),
            })
        } else {
            res = (currentSpan.end + 1) * 4000000 + y;
            break;
        }
    }
    if(res) {
        break;
    }
}

console.log('task2 ->', res)
