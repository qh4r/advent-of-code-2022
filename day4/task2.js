const data = require('fs').readFileSync('data4.txt').toString().trim().split('\n');

function getRange(input) {
    const [start, stop] = input.split('-')
    return [+start, +stop];
}

const res = data.reduce((out, x) => {
    const [first, second] = x.split(',');
    const [fstr, fstp] = getRange(first);
    const [sstr, sstp] = getRange(second);
    if((fstr >= sstr && fstr <=sstp) || (sstr >= fstr && sstr <=fstp) || (fstp >= sstr && fstp <= sstp) || (sstp >= fstr && sstp <= fstp)) {
        return out + 1;
    }
    return out;
}, 0)
console.log('task2 -> ',res);
