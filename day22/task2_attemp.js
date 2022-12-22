const [mapString, plan] = require('fs').readFileSync('data22.txt').toString().split('\n\n')

const map = mapString.split('\n')
const maxRowLength = map.map(row => row.length).sort((a,b)=> b -a)[0];

const areaMap = Array.from({length: map.length}).map(_ => Array.from({ length: maxRowLength}));
const rotatedAreaMap = Array.from({length: maxRowLength}).map(_ => Array.from({ length: map.length}));

const sideCapacity = 4;

const ranges = {
    A : {
        x: [8, 11],
        y: [0, 3],
    },
    B : {
        x: [0,3],
        y: [4,7],
    },
    C : {
        x: [4,7],
        y: [4,7],
    },
    D : {
        x: [8,11],
        y: [4,7],
    },
    E : {
        x: [8,11],
        y: [8,11],
    },
    F : {
        x: [12,15],
        y: [8,11],
    },
}

map.forEach((row,y) => {
    row.split('').forEach((spot, x) => {
        areaMap[y][x] = spot;
        rotatedAreaMap[x][y] = spot;
    })
});

const sideMaps = Object.keys(ranges).reduce((out, key) => {
    out.straight[key] = Array.from({ length: ranges[key].y[1] - ranges[key].y[0] + 1}).map(_ => Array.from({ length: ranges[key].x[1] - ranges[key].x[0] + 1}))
    out.inverted[key] = Array.from({ length: ranges[key].y[1] - ranges[key].y[0] + 1}).map(_ => Array.from({ length: ranges[key].x[1] - ranges[key].x[0] + 1}))
    out.straight[key].forEach((row, y) => {
        row.forEach((_, x) => {
            out.straight[key][y][x] = areaMap[ranges[key].y[0] + y][ranges[key].x[0] + x];
            out.inverted[key][x][y] = areaMap[ranges[key].y[0] + y][ranges[key].x[0] + x];
        });
    });

    return out;
}, {
    straight: {},
    inverted: {},
});
//   A
// BCD
//   EF
//
// A D E B(R)
// B C D F(R)
// A C E F(R)
//
const rotateXY = arr => [...arr.map(x => [...x].reverse())].reverse()
const rotateX = arr => [...arr.map(x => [...x].reverse())]
const rotateY = arr => [...arr].reverse()
const sideChains = {
    ADEB: [...sideMaps.straight.A, ...sideMaps.straight.D, ...sideMaps.straight.E, ...[...sideMaps.straight.B].map(x => [...x]).reverse()],
    BCDF: [...rotateX(sideMaps.inverted.B), ...rotateX(sideMaps.inverted.C), ...rotateX(sideMaps.inverted.D), ...sideMaps.straight.F],
    CAFE: [...rotateXY(sideMaps.straight.C), ...rotateX(sideMaps.inverted.A), ...rotateY(sideMaps.inverted.F), ...rotateY(sideMaps.inverted.E)],
}

const invert = (arr) => arr.reduce((out, row, y) => {
    row.forEach((cell, x) => {
        out[x][y] = cell;
    });
    return out;
}, Array.from({length: arr[0].length }).map(() => Array.from({ length: arr.length })))

const invertedSideChains = Object.keys(sideChains).reduce((out, key) =>{
    out[key] = invert(sideChains[key]);
    return out;
}, {});

const rx = /(\d+)|(\w)/;
const steps = plan.trim().split(rx).filter(x => !!x);

const location = {x: 0, y: 0, dir: 'E'};
const directions = {
    E: {L: 'N', R: 'S'},
    S: {L: 'E', R: 'W'},
    W: {L: 'S', R: 'N'},
    N: {L: 'W', R: 'E'},
};
const directionValues = {
    'E': 0,
    'S': 1,
    'W': 2,
    'N': 3,
}

const nonEmptyCells = ['.', '#'];
const move = (axis, steps) => {
    const diff = steps > 0 ? 1 : -1;
    if(axis === 'x') {
        for (let i = 0; diff > 0 ? i < steps : i > steps; diff > 0 ? i++ : i--) {
            const newX = location.x + diff >= 0 ? location.x + diff : areaMap[location.y].length + diff;
            if(areaMap[location.y][newX] && nonEmptyCells.includes(areaMap[location.y][newX])) {
                if(areaMap[location.y][newX] === '#') {
                    break;
                }
                location.x = newX;
            } else {
                let nextX;
                if(diff > 0) {
                    nextX = areaMap[location.y].findIndex(x => nonEmptyCells.includes(x));
                } else {
                    nextX = areaMap[location.y].length - [...areaMap[location.y]].reverse().findIndex(x => nonEmptyCells.includes(x)) - 1;
                }
                if(areaMap[location.y][nextX] === '#') {
                    break;
                } else {
                    location.x = nextX;
                }
            }
        }
    } else {
        for (let i = 0; diff > 0 ? i < steps : i > steps; diff > 0 ? i++ : i--) {
            const newY = location.y + diff >= 0 ? location.y + diff : rotatedAreaMap[location.x].length + diff;
            if(rotatedAreaMap[location.x][newY] && nonEmptyCells.includes(rotatedAreaMap[location.x][newY])) {
                if(rotatedAreaMap[location.x][newY] === '#') {
                    break;
                }
                location.y = newY;
            } else {
                let nextY;
                if(diff > 0) {
                    nextY = rotatedAreaMap[location.x].findIndex(x => nonEmptyCells.includes(x));
                } else {
                    nextY = rotatedAreaMap[location.x].length - [...rotatedAreaMap[location.x]].reverse().findIndex(x => nonEmptyCells.includes(x)) - 1;
                }
                if(rotatedAreaMap[location.x][nextY] === '#') {
                    break;
                } else {
                    location.y =nextY;
                }
            }
        }
    }
}

areaMap.find((row, y) => {
    const x = row.findIndex(s => s!== ' ');
    if(x  > - 1) {
        location.x = x;
        location.y = y;
        return true
    }
})

// steps.forEach(step => {
//     console.log(step, location);
//     if(Number.isNaN(+step)) {
//         location.dir = directions[location.dir][step];
//     } else {
//         if(location.dir === 'E') {
//             move('x', +step)
//         }
//         if(location.dir === 'S') {
//             move('y', step)
//         }
//         if(location.dir === 'W') {
//             move('x', -step)
//         }
//         if(location.dir === 'N') {
//             move('y', -step)
//         }
//     }
// })

const result = 1000*(location.y + 1) + 4 * (location.x + 1) + directionValues[location.dir];
console.log('loca',location);
console.log("task1 -> ", result);
// console.log(areaMap.map( row => row.map(x => !x ? '' : x).join('')).join('\n'));
// console.log(rotatedAreaMap.map( row => row.map(x => !x ? '' : x).join('')).join('\n'));

