const [cargo, steps] = require('fs').readFileSync('data5.txt').toString().split('\n\n');
const reversedCargo = cargo.split('\n').reverse().slice(1, 100);
const cargoArr = Array.from({length: reversedCargo[0].replace(/\W/g, '').length}).map(x => [])
reversedCargo.forEach(row => {
    let index = 1;
    cargoArr.forEach(slot => {
        if(row[index]?.trim()) {
            slot.push(row[index])
        }
        index += 4;
    })
})

steps.trim().split('\n').map(step => {
    const moveRx = /move\s?(?<col>\d+)\s?from\s?(?<from>\d+)\s?to\s?(?<to>\d+)\s?/g
    const {col, from, to} = moveRx.exec(step).groups
    const toMove = [];
    Array.from({length: +col}).forEach(_ => {
        toMove.unshift(cargoArr[+from-1].pop());
    })
    cargoArr[+to-1] = [...cargoArr[+to-1], ...toMove];
})
const res = []
cargoArr.forEach(slot => res.push(slot.pop()))

console.log('res', res.join(''));
