const { readFileSync } = require('fs');
const data = readFileSync('data1.txt');
const table = data.toString().split('\n\n');
const result = table.map(set => set.split('\n').map(x => {
    return Number.parseInt(x);
}).reduce((sum, x) => sum + x, 0)).sort((a,b) => b - a);
console.log("task 1 -> ", result[0]);
console.log("task 2 -> ", result.slice(0,3).reduce((sum, x) => sum+x, 0));
