const forest = require('fs').readFileSync('data8.txt').toString().trim().split('\n').map(l => l.split('').map(x => +x))

const rotate = (input) => [...input].reverse().map(x => [...x].reverse())

const findVisible = (input) => input.reduce((out, row, rowI) => {
    out.left = -1;
    row.map((tree, colI) => {
        if (tree > out.left) {
            out.score[rowI][colI] = 1;

        }
        if(tree > out.top[colI]) {
            out.score[rowI][colI] = 1;
            out.top[colI] = tree;
        }
    })
    return out;
}, {left: -1, top: Array.from({length: input[0].length}).map(x => -1), score: Array.from({length: input[0].length}).map(x => Array.from({length: input.length}))}).score

const rotatedForest = rotate(forest)
const firstLap = findVisible(forest);

const secondLap = rotate(findVisible(rotatedForest));
const task1 = firstLap.reduce((sum, row, i) => {
    row.forEach((val, j) => {
        if(val || secondLap[i][j])
            sum += 1;
    })
    return sum;
}, 0);

console.log('task1 -> ', task1);
