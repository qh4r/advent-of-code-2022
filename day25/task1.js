const lines = require('fs').readFileSync('data25.txt').toString().trim().split('\n')

const signMap = {
    "2": 2,
    "1": 1,
    "0": 0,
    "-": -1,
    "=": -2,
}

const decode = (line) => line.trim().split('').reduce((lineTotal, sign, i) => {
    return lineTotal + (signMap[sign] * (5 ** (line.length - 1 - i)));
}, 0);

const total = lines.reduce((total, line) => {
    return total + decode(line);
}, 0);


getPowersSum = (power) => Array.from({length: power + 1}).reduce((sum, _, i) => {
    return sum + (5 ** (power - i))
}, 0)

const toSnafu2 = (value) => {
    let power = -1;
    while (value > 2 * getPowersSum(power)) {
        power += 1;
    }

    const signs = []
    let sum = 0;

    for (let i = 0; i <= power; i++) {

        const currentPower = power - i;
        const powerValue = 5 ** currentPower;
        if(value > sum + powerValue + 2* getPowersSum(currentPower - 1)) {
            sum += powerValue * 2;
            signs.push('2');
        } else if(value > sum + 2* getPowersSum(currentPower - 1)) {
            sum += powerValue;
            signs.push('1');
        } else if(value < sum - powerValue - 2 * getPowersSum(currentPower - 1)) {
            sum -= powerValue * 2;
            signs.push('=');
        } else if(value < sum - 2 * getPowersSum(currentPower - 1)) {
            sum -= powerValue;
            signs.push('-');
        } else {
            signs.push('0');
        }

    }

    return signs.join('');
}

console.log("task1 -> ", total, toSnafu2(total));

// too low
// 2=001=-2=--1======== wrong
// 2=001=-2=--0212-22-2
