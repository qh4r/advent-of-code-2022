const signals = require('fs').readFileSync('data10.txt').toString().trim().split('\n');

const draw = (status) => {
    status.crt.push([status.x - 1, status.x, status.x + 1].includes(status.caret) ? '#' : '.');
    status.caret = (status.caret + 1) % 40;
}

const data = signals.reduce((status, signal) => {
    const [op, value] = signal.split(' ');
    status.cycle++;
    draw(status);
    if(op === 'noop') {
        status.history[status.cycle] = (status.x);
    } else {
        status.history[status.cycle] = (status.x);
        status.cycle++
        draw(status);
        status.history[status.cycle] = (status.x);
        status.x += +value;
    }
    return status;
}, {
    x: 1,
    cycle: 0,
    caret: 0,
    history: [],
    crt: []
})

const task1 = [20, 60, 100, 140, 180, 220].reduce((sum, x) => sum + data.history[x] * x, 0)

console.log('task1 -> ', task1);

while(data.crt.length) {
    console.log('task2 -> ', data.crt.splice(0, 40).join(''));
}
