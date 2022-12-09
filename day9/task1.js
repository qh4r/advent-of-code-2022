const data = require('fs').readFileSync('data9.txt').toString().trim().split('\n')

let headX = 0;
let tailX = 0;
let headY = 0;
let tailY = 0;
const positions = {}

const makeMove = (direction, distance) => {
    let i = distance;

    while(i > 0) {
        let prevX = headX;
        let prevY = headY;

        if (direction === 'U') {
            headY += 1;
        } else if (direction === 'D') {
            headY -= 1;
        } else if (direction === 'L') {
            headX -= 1;
        } else if (direction === 'R') {
            headX += 1;
        }

        const diffX = Math.abs(headX - tailX);
        const diffY = Math.abs(headY - tailY);

        if((diffX > 1) || diffY > 1) {
            tailX = prevX;
            tailY = prevY;
        }
        positions[`${tailX.toString()},'${tailY.toString()}'`] = 1;
        i--;
    }
}

data.forEach(row => {
    const [direction, distance] = row.split(' ');
    makeMove(direction, distance)
})

const task1 = Object.values(positions).reduce((sum, x) => sum+x, 0);

console.log('task1 -> ', task1);
