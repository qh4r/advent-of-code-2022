const lines = require('fs').readFileSync('data23.txt').toString().split('\n')

const extremes = {
    maxX: -Infinity,
    maxY: -Infinity,
    minX: Infinity,
    minY: Infinity,
}

const lengthY = lines.length
const lengthX = lines[0].length

const field = Array.from({length: lengthY * 3}).map(_ => Array.from({length: lengthX * 3}).fill('.'))
const elves = []
const directions = ['N', 'S', 'W', 'E'];

const canMove = {
    'N': ({x, y}) => (![field[y - 1][x - 1], field[y - 1][x], field[y - 1][x + 1]].includes('#')),
    'S': ({x, y}) => (![field[y + 1][x - 1], field[y + 1][x], field[y + 1][x + 1]].includes('#')),
    'W': ({x, y}) => (![field[y - 1][x - 1], field[y][x - 1], field[y + 1][x - 1]].includes('#')),
    'E': ({x, y}) => (![field[y - 1][x + 1], field[y][x + 1], field[y + 1][x + 1]].includes('#')),
}
const makeMove = {
    'N': ({x, y}) => ({x, y: y - 1}),
    'S': ({x, y}) => ({x, y: y + 1}),
    'W': ({x, y}) => ({x: x - 1, y}),
    'E': ({x, y}) => ({x: x + 1, y}),
}

const updateExtremes = ({y, x}) => {
    if (y > extremes.maxY) extremes.maxY = y;
    if (y < extremes.minY) extremes.minY = y;
    if (x > extremes.maxX) extremes.maxX = x;
    if (x < extremes.minX) extremes.minX = x;
}

const noAdjacent = ({x,y}, directions) => {
    return directions.reduce((out, dir) => {
        return out && canMove[dir]({x, y});
    }, true);
}


lines.forEach((line, y) => {
    line.trim().split('').forEach((cell, x) => {
        const newY = lengthY + y;
        const newX = lengthX + x;
        field[newY][newX] = cell;
        if (cell === '#') {
            elves.push({
                x: newX,
                y: newY
            });
        }
    })
})

let movesToDo = {};

const elvToString = ({x, y}) => `${x}_${y}`;

const planMove = (elv, directions) => {
    const matchDirection = directions.find(dir => canMove[dir](elv));
    if(noAdjacent(elv, directions)) {
        return;
    }
    if (matchDirection) {
        const newLocation = makeMove[matchDirection](elv);
        if (!movesToDo[elvToString(newLocation)]) {
            movesToDo[elvToString(newLocation)] = {
                elv,
                newLocation,
                pretender: 1,
            }
        } else {
            movesToDo[elvToString(newLocation)].pretender += 1;
        }
    }
}

const executeMove = ({elv, newLocation}) => {
    const oldLocation = {...elv};
    if(!field[newLocation.y] || !field[newLocation.y][newLocation.x]) {
        console.log('err loc', newLocation, field[oldLocation.y][oldLocation.x]);
        throw new Error('!!!!!!')
    }
    field[oldLocation.y][oldLocation.x] = '.';
    field[newLocation.y][newLocation.x] = '#';
    elv.x = newLocation.x;
    elv.y = newLocation.y;
}

let turns = 0;
while(true) {
    turns += 1;
    movesToDo = {};
    elves.forEach(elv => {
        planMove(elv, [...directions]);
    })

    const movesToExecute = [];
    Object.keys(movesToDo).forEach(moveKey => {
        if (movesToDo[moveKey].pretender === 1) {
            movesToExecute.push(movesToDo[moveKey])
        }
    })

    movesToDo = {};

    movesToExecute.forEach(move => {
        executeMove(move)
    });

    if(movesToExecute.length === 0) break;

    directions.push(directions.shift());
}


console.log("task1 -> ", turns);

