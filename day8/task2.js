const forest = require('fs').readFileSync('data8.txt').toString().trim().split('\n').map(l => l.split('').map(x => +x))

const rotate = (input) => [...input].reverse().map(x => [...x].reverse())

const findVisible = (input) => input.reduce((score, row, rowI) => {
    row.map((tree, colI) => {
        let i = 1;
        let j = 1;
        let scoreI = 0;
        let scoreJ = 0;
        while(true) {
            if(rowI - i < 0) {
                break;
            }
            scoreI += 1;
            if(input[Math.max(rowI - i, 0)][colI] < tree) {
                i++;
            } else {
                break;
            }
        }

        while(true) {
            if(colI - j < 0) {
                break;
            }
            scoreJ += 1;
            if(input[rowI][Math.max(colI - j, 0)] < tree) {
                j++;
            } else {
                break;
            }
        }

        score[rowI][colI] = scoreI * scoreJ;
    })
    return score;
}, Array.from({length: input[0].length}).map(x => Array.from({length: input.length})))

const rotatedForest = rotate(forest)
const firstLap = findVisible(forest);
const secondLap = rotate(findVisible(rotatedForest));

const task2 = firstLap.reduce((out, row, i) => {
    row.forEach((tree, j) => {
        const score = tree * secondLap[i][j];
        if(score > out.top)
            out.top = score;
    });
    return out;
}, {top: 0}).top;

console.log('task2 -> ', task2);
