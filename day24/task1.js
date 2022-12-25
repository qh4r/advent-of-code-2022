const lines = require('fs').readFileSync('data24.txt').toString().trim().split('\n')

const columnsLength = lines.length;
const rowsLength = lines[0].length;

const windTypes = ['^', '<', '>', 'v'];
const wall = '#';
const emptyCell = '.';

const area = Array.from({length: columnsLength})
    .map(_ => Array.from({length: rowsLength}).fill(0))

const windsOnX = Array.from({length: rowsLength}).map(_ => []);
const windsOnY = Array.from({length: columnsLength}).map(_ => []);
const out = []
const makeWind = ({cell, x, y}, print) => {
    const history = [];
    let calcY, calcX, constAxis, module;

    if (['^', 'v'].includes(cell)) {
        constAxis = 'x'
            calcY = cell === '^' ? (
                (turns) => (columnsLength - 2) + (-((columnsLength - 2) - y) - turns) % (columnsLength - 2)
            ) : ((turns) => ((y + turns - 1)) % (columnsLength - 2) + 1)
        calcX = () => x;
        module = columnsLength - 2;
    } else {
        module = rowsLength - 2;
        constAxis = 'y'
        calcY = () => y;
        calcX = cell === '<' ? (
            (turns) => (rowsLength - 2) + (-((rowsLength - 2) - x) - turns) % (rowsLength - 2)
        ) : ((turns) => ((x + turns - 1)) % (rowsLength - 2) + 1)
    }
    return {
        calcPosition: (turn) => {
            const turnKey = turn % module
            if (!history[turn]) {
                history[turn] = {
                    x: calcX(turn),
                    y: calcY(turn),
                }
            }

            if (print)
                if (out[out.length - 1] !== `${cell} - ${turn}, ${turnKey}, ${JSON.stringify(history[turn])}`) {
                    out.push(`${cell} - ${turn}, ${turnKey}, ${JSON.stringify(history[turn])}`);
                    console.log(`${cell} - ${turn}, ${turnKey}, ${JSON.stringify(history[turn])}`);
                }
            return history[turn]

        },
        constAxis,
    }
}

lines.forEach((line, y) => {
    line.split('').forEach((cell, x) => {
        if (cell === '#') {
            area[y][x] = wall;
        } else if (windTypes.includes(cell)) {
            area[y][x] = emptyCell;
            const wind = makeWind({x, y, cell}, x === 5 && y === 1);
            if (wind.constAxis === 'x') {
                windsOnX[x].push(wind);
            } else {
                windsOnY[y].push(wind);
            }
        } else {
            area[y][x] = emptyCell;
        }
    })
});

let makeExpedition = ({x, y, history = [], moves = 0}) => ({
    x,
    y,
    history,
    moves,
});

possibleMoves = ({x, y}) => ([{x, y}, {x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1}]);

const target = {
    y: area.length - 1,
    x: area[area.length - 1].findIndex(x => x === '.')
}
const start = {y: 0, x: 1}

const areas = Array.from({length: Math.max(columnsLength, rowsLength)}).map((_, i) => {
    const newArea = Array.from({length: columnsLength})
        .map(_ => Array.from({length: rowsLength}).fill(false))
    newArea.forEach((row, y) => {
        row.forEach((cell, x) => {
            const move = {y, x};
            if (area[y][x] === wall) {
                newArea[y][x] = false;
            } else {
                newArea[y][x] = !(windsOnX[move.x].find(wind => wind.calcPosition(i).y === move.y)
                    || windsOnY[move.y].find(wind => wind.calcPosition(i).x === move.x));
            }
        })
    });
    return newArea;
});

const runAttempt = (start, target, offset) => {
    const visited = new Set();

    const pointToString = ({x, y}, turns) => `${x}_${y}_${turns}`;

    const getSafeFields = (expedition) => {
        return possibleMoves(expedition).filter(move => {

            if (move.x < 0 || move.y < 0 || move.y > columnsLength - 1 || move.x > rowsLength -1) {
                return false;
            }

            if (visited.has(pointToString(move, expedition.moves+1))) {
                return false;
            }
            if (area[move.y][move.x] === '#') {
                return false;
            }
            return !(windsOnX[move.x].find(wind => wind.calcPosition(expedition.moves + 1).y === move.y)
                || windsOnY[move.y].find(wind => wind.calcPosition(expedition.moves + 1).x === move.x));
            // return areas[(expedition.moves) % (Math.max(columnsLength, rowsLength) - 2) + 1][move.y][move.x];
        });
    }

    let expeditions = [makeExpedition({...start, moves: offset})]

    let result;

    while (true) {
        const expedition = expeditions.shift();
        visited.add(pointToString(expedition, expedition.moves));
        const safeMoves = getSafeFields(expedition);

        if (safeMoves.length > 0) {
            const finish = safeMoves.find(move => move.x === target.x && move.y === target.y);
            if (finish) {
                result = makeExpedition({
                    x: finish.x,
                    y: finish.y,
                    visited: expedition.visited,
                    history: [...expedition.history, {...finish}],
                    visitedTwice: expedition.visitedTwice,
                    moves: expedition.moves + 1
                });
                break;
            }
            safeMoves.map(move => {
                visited.add(pointToString(move, expedition.moves + 1));
            });
            expeditions = expeditions.concat(safeMoves.map(move => {

                return makeExpedition({
                    ...move,
                    history: [...expedition.history, {...move}],
                    moves: expedition.moves + 1,
                })
            }));
        }
    }

    return result;
}

const result = runAttempt(start, target, 0);
const result2 = runAttempt(target, start, result.moves);
const result3 = runAttempt(start, target, result2.moves);

console.log("task1 -> ", result);
console.log("task2 -> ", result3.moves);

// too low
