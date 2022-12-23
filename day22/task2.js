const [mapString, plan] = require('fs').readFileSync('data22.txt').toString().split('\n\n')

const map = mapString.split('\n')
const maxRowLength = map.map(row => row.length).sort((a, b) => b - a)[0];
const maxColLength = map.length;

const areaMap = Array.from({length: maxColLength + 2}).map(_ => Array.from({length: maxRowLength + 2}));
// const rotatedAreaMap = Array.from({length: maxRowLength}).map(_ => Array.from({length: map.length}));

const makePointers = (length, offset, pointerObj, log) => {

    const res = Array.from({length}).reduce((out, _, i) => {
        out[i + offset + 1] = pointerObj;
        return out;
    }, {});
    if (log) {
        console.log(log, res);
    }

    return res;
}
const pointers = {
    x: {
        ...makePointers(4, 0, {
            y: {
                '4': {
                    'N': {
                        y: () => 1,
                        x: ({x}) => x + 8,
                        dirTo: 'S'
                    }
                },
                '9': {
                    'S': {
                        y: () => 12,
                        x: ({x}) => x + 8,
                        dirTo: 'N'
                    }
                }
            }
        }),
        ...makePointers(3, 4, {
            y: {
                '4': {
                    'N': {
                        y: ({x}) => {console.log('TYNCHUJU', x); return x - 4},
                        x: () => 9,
                        dirTo: 'E'
                    }
                },
                '9': {
                    'S': {
                        y: ({x}) => maxColLength - x + 5,
                        x: () => 9,
                        dirTo: 'E'
                    }
                }
            }
        }),
        ...makePointers(4, 8, {
            y: {
                '0': {
                    'N': {
                        y: () => 5,
                        x: ({x}) => maxColLength - x + 1,
                        dirTo: 'S'
                    }
                },
                '13': {
                    'S': {
                        y: () => 8,
                        x: ({x}) => maxColLength - x + 1,
                        dirTo: 'N'
                    }
                }
            }
        }),
        ...makePointers(3, 13, {
            y: {
                '8': {
                    'N': {
                        y: ({x}) => x - 8,
                        x: () => 12,
                        dirTo: 'W'
                    }
                },
                '13': {
                    'S': {
                        y: ({x}) => maxRowLength - x + 5,
                        x: () => 1,
                        dirTo: 'E'
                    }
                }
            }
        }),
        '13': {
            y: {
                ...makePointers(4, 0, {
                    'E': {
                        y: ({y}) => maxRowLength + 1 - y,
                        x: () => 16,
                        dirTo: 'W'
                    }
                }),
                ...makePointers(4, 4, {
                    'E': {
                        y: () => 9,
                        x: ({ y }) => maxRowLength - y + 5, // no -1 cause of 2 points frame
                        dirTo: 'S'
                    },
                    'N': {
                        y: ({x}) => x - 8,
                        x: () => 12,
                        dirTo: 'W'
                    },
                }),
                '13': {
                    'S': {
                        y: ({x}) => maxRowLength - x + 5,
                        x: () => 1,
                        dirTo: 'E'
                    }
                }
            }
        },
        '17': {
            y: {
                ...makePointers(4, 8, {
                    'E': {
                        y: ({y}) => maxColLength - y + 1,
                        x: () => 12,
                        dirTo: 'W'
                    }
                })
            }
        },
        '8': {
            y: {
                ...makePointers(4, 0, {
                    'W': {
                        y: () => 5,
                        x: ({y}) => y + 4,
                        dirTo: 'S'
                    },
                    'N': {
                        y: ({x}) => x - 4,
                        x: () => 9,
                        dirTo: 'E'
                    }
                }),
                ...makePointers(4, 8, {
                    'W': {
                        y: () => 8,
                        x: ({y}) => maxColLength - y + 5,
                        dirTo: ''
                    },
                    'S': {
                        y: () => 12,
                        x: ({x}) => x + 8,
                        dirTo: 'N'
                    }
                }),
            }
        },
        '0': {
            y: {
                ...makePointers(4, 4, {
                    'W': {
                        y: () => 12,
                        x: ({y}) => maxRowLength - y + 5,
                        dirTo: 'N'
                    }
                }),
            }
        }
    }
}

map.forEach((row, y) => {
    row.split('').forEach((spot, x) => {
        areaMap[y + 1][x + 1] = spot;
        // rotatedAreaMap[x][y] = spot;
    })
});

areaMap.forEach((row, y) => {
    row.forEach((_, x) => {
        if (pointers.x[x]?.y[y]) {
            areaMap[y][x] = pointers.x[x]?.y[y];
        }
    })
})

console.log(areaMap.map(row => row.map(x => !x ? '' : (typeof x === 'object' ? 'W' : x)).join('')).join('\n'));
console.log(JSON.stringify(pointers));
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

const dirEffects = {
    y: {
        N: -1,
        S: +1,
        E: 0,
        W: 0,
    },
    x: {
        E: +1,
        W: -1,
        N: 0,
        S: 0,
    }
}

const moveStep = (location) => {
    const newX = location.x + dirEffects.x[location.dir];
    const newY = location.y + dirEffects.y[location.dir];
    console.log('y', newY, 'x',newX, areaMap[newY][newX]);
    if (areaMap[newY][newX]) {
        if (areaMap[newY][newX] === '#') {
            return 'break';
        }
        if (typeof areaMap[newY][newX] === 'object') {
            const pointer = areaMap[newY][newX];
            console.log(JSON.stringify('p', pointer), 'in', JSON.stringify(pointer[location.dir]), location.dir);
            console.log('to', {x: location.x, y: location.y});
            const oldLocation = {x: location.x, y: location.y};
            const jumpX = pointer[location.dir].x(oldLocation);
            const jumpY = pointer[location.dir].y(oldLocation);
            if (areaMap[jumpY][jumpX] === '#') {
                return 'break';
            }
            location.x = jumpX;
            location.y = jumpY;
            location.dir = pointer[location.dir].dirTo;
            console.log('JUMP', location);
        } else {
            location.x = newX;
            location.y = newY;
        }
    }
};
const move = (steps) => {
    for (let i = 1; i <= steps; i++) {
        const res = moveStep(location);
        if (res === "break") {
            break;
        }
    }
}


location.x = 50;
location.y = 1;

steps.forEach(step => {
    console.log('before', step, location);
    if (Number.isNaN(+step)) {
        location.dir = directions[location.dir][step];
    } else {
        move(+step)
    }
    console.log('after', step, location);
})

const result = 1000 * (location.y) + 4 * (location.x) + directionValues[location.dir];
console.log("task2 -> ", result);

// 156166

