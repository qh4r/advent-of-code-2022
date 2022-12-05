const data = require('fs').readFileSync('data3.txt').toString().trim().split('\n');
const weight = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('').reduce((out, x,i) => {
        return {...out, [x]: i + 1};
    }, {})
const res = data.reduce((out, x) => {
    const first = x.slice(0, x.length / 2 )
    const second = x.slice(x.length / 2, x.length)
    const regex = new RegExp(`[${first}]`);
    return out + weight[regex.exec(second)[0]];
},0)
console.log('task1 -> ',res);
