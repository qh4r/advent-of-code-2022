const data = require('fs').readFileSync('data2.txt').toString().trim().split('\n');
const own = { X : 1, Y: 2, Z: 3}
const enemy = { A : { X : 3, Y: 6, Z: 0}, B: { X : 0, Y: 3, Z: 6}, C: { X : 6, Y: 0, Z: 3}}
const res = data.reduce((out, x) => {
    const [en, me] = x.split(' ');
    return out + own[me] + enemy[en][me];
},0)
console.log('task1 -> ',res);
