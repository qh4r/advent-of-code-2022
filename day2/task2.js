const data = require('fs').readFileSync('data2.txt').toString().trim().split('\n');
const enemy = { A : { X : 3, Y: 4, Z: 8}, B: { X : 1, Y: 5, Z: 9}, C: { X : 2, Y: 6, Z: 7}}
const res = data.reduce((out, x) => {
    const [en, res] = x.split(' ');
    console.log(en, res, out, enemy[en][res])
    return out + enemy[en][res];
},0)
console.log('task2 -> ',res);
