const makeEmptyRow = () => Array.from({length: 9}).map((_, i) => [0, 8].includes(i) ? 1 : 0);

const countTop = (stop, breakForCycles = false) => {
    let block = 0;
    let top = 1;
    let signCount = 0;
    let rockCount = 0;
    let lrStats = 0;
    let signsUsed = 0;
    const cycles = [];
    const room = [Array.from({length: 9}).fill(1), makeEmptyRow()];

    const startLeft = 3;
    const startBot = 4;

    const signs = require('fs').readFileSync('data17.txt').toString().trim().split('');

    const shapes = [
        [[1, 1, 1, 1]],
        [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
        [[1, 1, 1], [0, 0, 1], [0, 0, 1]],
        [[1], [1], [1], [1]],
        [[1, 1], [1, 1]],
    ]

    const stopTheRock = (shape, y, x) => {
        return shape.forEach((row, yi) => {
            row.forEach((cell, xi) => {
                if (cell) {
                    room[y + yi][x + xi] = 1;
                }
            }, true)
        }, true)
    }
    const canMove = (shape, y, x, moveX, moveY) => {
        return shape.reduce((freeToMove, row, yi) => {
            return freeToMove && row.reduce((freeToMove, cell, xi) => {
                if (cell && room[y + yi + moveY] && room[y + yi + moveY][x + xi + moveX]) {
                    return false;
                }
                return freeToMove && true;
            }, true)
        }, true)
    }
    while (true) {
        if(breakForCycles && (cycles.length > 1)) {
            break;
        }
        block += 1;
        if (block > stop) {
            break;
        }
        let goDown = false;
        const rock = shapes.shift();
        shapes.push(rock);
        rockCount = (rockCount + 1) % shapes.length
        let y = top + startBot;
        let x = startLeft; //+ rock[0].findIndex(x => x === 1);
        if (y + rock.length + 1 > room.length) {
            for (let i = 0; i <= (y + rock.length + 1) - room.length; i++) {
                room.push(makeEmptyRow());
            }
        }
        while (true) {
            if (goDown) {
                if (canMove(rock, y - 1, x, 0, -1)) {
                    y = y - 1;
                } else {
                    stopTheRock(rock, y - 1, x)
                    const reversed = [...room].reverse();
                    const index = reversed.findIndex(row => row.slice(1, 8).findIndex(c => !!c) > -1);
                    top = room.length - index;
                    break;
                }
            } else {
                const sign = signs.shift();
                signs.push(sign);
                signsUsed += 1;
                if (sign === '<') {
                    if (canMove(rock, y - 1, x, -1, 0)) {
                        x = x - 1;
                    }
                    lrStats -= 1;
                } else {
                    if (canMove(rock, y - 1, x, 1, 0)) {
                        x = x + 1;
                    }
                    lrStats += 1;
                }
                signCount = (signCount + 1) % signs.length;
                if(signCount === 0) {
                    // console.log('0 on side', rockCount, 'top', top - 1, 'block', block)
                    if(rockCount === 2) {
                        cycles.push({
                            currentBlock: block,
                            currentTop: top -1
                        })
                    }
                }
            }
            goDown = !goDown;
        }
    }
    return {
        top: top -1,
        cycles,
    }
}
// console.log(room.reverse().map(row => row.map(x => x ? "#" : '.').join('')).join('\n'));
console.log('task1 ->', countTop(2022));

const searchBlocks = 1000000000000;
const firstSearchResult = countTop(searchBlocks, true);

const firstCycle = firstSearchResult.cycles[0];
const secondCycle = firstSearchResult.cycles[1];

const blocksCycleDiff = secondCycle.currentBlock - firstCycle.currentBlock;
const topCycleDiff = secondCycle.currentTop - firstCycle.currentTop;

const fullCyclesCount = Math.floor((searchBlocks - firstCycle.currentBlock) / blocksCycleDiff);
const blocksInFullCycles = fullCyclesCount * blocksCycleDiff;
const leftoverBlocks = searchBlocks - blocksInFullCycles;
const realLeftover = leftoverBlocks - firstCycle.currentBlock;
const secondSearchResult = countTop(realLeftover + secondCycle.currentBlock);
const topOverflow = secondSearchResult.top - secondCycle.currentTop;
const cyclesTop = fullCyclesCount * topCycleDiff;
const result = topOverflow + cyclesTop + firstCycle.currentTop;
console.log("task 2 ->",result);

//EX
//cycles [
//   { currentBlock: 37, currentTop: 61 },
//   { currentBlock: 72, currentTop: 114 },
//   { currentBlock: 107, currentTop: 167 }
// ]
// 1st is 2 stones larger
// 1000000000000 - 37 = 999999999963
// 72-37 = 35
// 114 - 61 = 53
// 999999999963 / 35 = 28571428570.37143
// 28571428570 * 35 = 999999999950
// 1000000000000 - 999999999950 = 50
// 8571428570 * 53 = 1514285714210
//72 + 50 = 122
//188 - 167 = 21 top overflow
// 1514285714288 right
// 1514285714292 - wrong - right with 2 stones less

//REAL
//cycles [
//   { currentBlock: 1752, currentTop: 2726 },
//   { currentBlock: 3507, currentTop: 5494 },
//   { currentBlock: 5262, currentTop: 8262 }
// ]
// 1st is 3 stones smaller
// remember last rock starts falling
// 569800569.8005698
//  blocks cycle 1755
// 2768 heigh cycle
// FIRST 0 on side 2 top 2726 block 1752
// 999999998248 / 1755 = 569800568.8022792
// 1000000000000 - 1752 = 999999998248
// 0 on side 2 top 5494 block 3507
// 3160 leftover
// 4997 - leftover height?
// 1577207972224 + 2726 + overflow (.8022792)
// 999999996840 blocks w/o overflow -> 3160 blocks left
// 3160 - 1752 = 1408
// 3507 + 1408 = 4915 // stable after 2 cycles
// 5262 + 1408 - 6670
// top 5494 block 3507
// top 8262 block 5262
// 4915 -> top 7730
// 7730 - 5494 = 2236 = overflow?
// 10498 - 8262 = 2236  = same overflow
// 1577207972224 + 2726 + 2236 = 1577207977186 BINGO!
