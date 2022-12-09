const data = require('fs').readFileSync('data9.txt').toString().trim().split('\n')

let line = Array.from({length: 10}).map(_ => ({X: 0, Y: 0}))
const positions = {}

const moveHead = (direction, head) => {
    if (direction === 'U') {
        head.Y += 1;
    } else if (direction === 'D') {
        head.Y -= 1;
    } else if (direction === 'L') {
        head.X -= 1;
    } else if (direction === 'R') {
        head.X += 1;
    }

}
const makeMove = (direction, distance) => {
    let i = distance;

    while (i > 0) {
        const tail = line.reduce((head, tail, i) => {
            if (i === 1) {
                moveHead(direction, head);
            }

            const diffX = head.X - tail.X;
            const diffY = head.Y - tail.Y;

            if (Math.abs(diffX) > 1) {
                tail.X = tail.X + diffX / 2;
                if (diffY) tail.Y +=  diffY > 0 ? 1 : -1;
            } else if (Math.abs(diffY) > 1) {
                tail.Y = tail.Y + diffY / 2;
                if (diffX) tail.X +=  diffX > 0 ? 1 : -1;
            }
            return tail;
        })
        positions[`${tail.X.toString()},'${tail.Y.toString()}'`] = 1;

        i--;
    }
}

data.forEach(row => {
    const [direction, distance] = row.split(' ');
    makeMove(direction, distance)
})

const task2 = Object.values(positions).reduce((sum, x) => sum + x, 0);

console.log('task2 -> ', task2);

