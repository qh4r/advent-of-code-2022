const numberStrings = require('fs').readFileSync('data20.txt').toString().trim().split('\n').map(x => Symbol(x));
const clonedNumbers = [...numberStrings];
const numbersLength = numberStrings.length;

const getTargetI = (currentIndex, currentValue) => {
    return (currentIndex + currentValue) % (numbersLength - 1);
}
const rotateLeft = () => {
    numberStrings.push(numberStrings.shift());
}

const rotateRight = () => {
    numberStrings.unshift(numberStrings.pop());
}

clonedNumbers.forEach(currentSymbol => {
    const currentIndex = numberStrings.findIndex(x => x === currentSymbol);
    const current = currentSymbol.description
    if (+current === 0) return;
    const targetIndex = getTargetI(currentIndex, +current);
    numberStrings.splice(currentIndex, 1);
    numberStrings.splice(targetIndex, 0, currentSymbol);
    if (targetIndex === 0) {
        if (+current > 0) {
            rotateRight();
        }
        if (+current < 0) {
            rotateLeft();
        }
    }
});

const indexZero = numberStrings.findIndex(x => x.description === '0');

const indexes = Array.from({length: 3}).map((_, i) => (indexZero + ((i + 1) * 1000)) % numbersLength);
console.log("task1 -> ", indexes.reduce((out, i) => {
    return out + (+numberStrings[i].description);
}, 0));
