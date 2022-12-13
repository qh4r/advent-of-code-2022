const pairs = require('fs').readFileSync('data13.txt').toString().trim().split('\n\n');

const ensureArray = (x) => Array.isArray(x) ? x : [x];

const comparePairs = (pairA, pairB) => {
    for (let i = 0; i <= Math.max(pairA.length - 1, pairB.length - 1); i++) {
        if (Array.isArray(pairA[i]) || Array.isArray(pairB[i])) {
            const res = comparePairs(ensureArray(pairA[i]), ensureArray(pairB[i]));
            if (res !== 0) return res;
        } else {
            if (pairA[i] === undefined || pairB[i] === undefined) {
                if (pairB[i] !== undefined) return -1
                if (pairA[i] !== undefined) return 1
                return 0
            }
            const comparison = ((pairA[i] ?? 0) - pairB[i]);
            if (comparison < 0) {
                return -1;
            } else if (comparison > 0) {
                return 1;
            }
        }
    }
    return 0;
}
const dividers = ['[[2]]', '[[6]]'];
const packets = [...dividers, ...pairs.map((pair) => {
    const [a, b] = pair.split('\n');
    return [a, b]
}).flat()].sort((a, b) => comparePairs(ensureArray(JSON.parse(a)), ensureArray(JSON.parse(b))))

const task2 = dividers.reduce((sum, div) => {
    return sum * (packets.findIndex(x => {
        return x.trim() === div
    }) + 1);
}, 1);

console.log('task2 -> ', task2);
