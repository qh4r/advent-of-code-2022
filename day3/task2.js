const data = require('fs').readFileSync('data3.txt').toString().trim().split('\n');
const weight = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('').reduce((out, x,i) => {
        return {...out, [x]: i + 1};
    }, {})
const res = data.reduce((out, x) => {
    out.stack.push(x);
    if(out.stack.length < 3) {
        return out;
    }
    const str = out.stack.map(x => Array.from(new Set(x)).join('')).join('').split('').sort().join('')
    return {res: out.res + weight[/(\w)\1\1/.exec(str)[1]], stack: []}
},{res: 0 , stack: []})
console.log('task2 -> ',res);
