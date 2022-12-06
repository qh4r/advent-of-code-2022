const data = require('fs').readFileSync('data6.txt').toString()
const searchArr = [];
const res = data.split('').findIndex((letter, i) => {
    searchArr.push(letter);
    if(searchArr.length > 4) searchArr.shift()
    return Array.from(new Set(searchArr)).length === 4
})
console.log('task1 ->', res + 1);
