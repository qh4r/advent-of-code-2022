const lines = require('fs').readFileSync('data14.txt').toString().trim().split('\n');

const maze = Array.from({length: 1000}).map(_ => []);
let maxY = 0;
lines.map(line => {
    line.split('->').map(pair => {
        const [x, y] = pair.trim().split(',').map(x => +x);
        return {x, y};
    }).reduce((start, end) => {
        while(start.x !== end.x || start.y !== end.y){
            maze[start.y][start.x] = 'X'
            if(end.x !== start.x) {
                start.x += end.x > start.x ? 1 : -1;
            } else if(end.y !== start.y) {
                start.y += end.y > start.y ? 1 : -1;
            }
        }
        maze[start.y][start.x] = 'X'
        if(end.y > maxY) {
            maxY = end.y;
        }
        return end;
    })
});

maze[maxY].map(x => 'X');

let sandRested = 0;
let sand = { x: 500, y: 0 };
while(true) {
    let moved = 1;
    while(moved > 0) {
        moved = 0;
        if (maze[sand.y + 1][sand.x] !== 'X') {
            moved +=1;
            sand.y += 1;
        } else if (maze[sand.y + 1][sand.x - 1] !== 'X') {
            moved +=1;
            sand.y += 1;
            sand.x -= 1;
        } else if (maze[sand.y + 1][sand.x + 1] !== 'X') {
            moved +=1;
            sand.y += 1;
            sand.x += 1;
        }
        if (sand.y > maxY) {
            break;
        }
    }
    sandRested +=1;
    if(sand.x === 500 && sand.y === 0) {
        break;
    }
    maze[sand.y][sand.x] = 'X';
    sand = { x: 500, y: 0 };
}

console.log('task2 -> ', sandRested);
