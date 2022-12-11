const input = require('fs').readFileSync('data11.txt').toString().trim().split('\n');

const monkeys = [];

const makeMonkey = () => {
    let inspected = 0;
    let items = [];
    let itemOperation;
    let itemTest;
    let trueThrowMonkey;
    let falseThrowMonkey;
    const throwItem = (item) => {
        inspected++;
        const newItem = Math.floor(itemOperation(item) / 3);
        const targetMonkey = itemTest(newItem) ? monkeys[trueThrowMonkey] : monkeys[falseThrowMonkey];
        targetMonkey.catchItem(newItem);
    }

    return {
        assignItems: (newItems) => items = newItems.map(x => +x),
        makeOperation: (arg1, sign, arg2) => {
            itemOperation = new Function('old', `return ${arg1} ${sign} ${arg2}`)
        },
        makeItemTest: (dividedBy) => {
            itemTest = (item) => (item % +dividedBy) === 0
        },
        setTrueMonkey: (newMonkey) => trueThrowMonkey = newMonkey,
        setFalseMonkey: (newMonkey) => falseThrowMonkey = newMonkey,
        throwItems: () => {
            while (items.length > 0) {
                throwItem(items.shift())
            }
        },
        catchItem: (item) => items.push(item),
        getInspected: () => inspected,
        getItems: () => [...items],
    }
}

input.forEach(line => {
    const lineRegex = /^Monkey\s?(?<monkey>\d+)|items:(?<items>(\s?\d+,?)+)|(\=\s?(?<arg1>\S+)\s?(?<sign>[\+\*\-])\s(?<arg2>\S+)?)|(Test:.*?(?<test>\d+))|(true:.*?(?<trueTarget>\d+))|(false:.*?(?<falseTarget>\d+))/;
    const result = lineRegex.exec(line);
    if(result) {
        if(result.groups.monkey) {
            return monkeys.push(makeMonkey());
        }
        const lastMonkey = monkeys[monkeys.length - 1];
        if(result.groups.items) {
            return lastMonkey.assignItems(result.groups.items.split(','))
        }
        if(result.groups.sign) {
            return lastMonkey.makeOperation(
                result.groups.arg1,
                result.groups.sign,
                result.groups.arg2
            )
        }
        if(result.groups.test) {
            return lastMonkey.makeItemTest(result.groups.test)
        }
        if(result.groups.falseTarget) {
            return lastMonkey.setFalseMonkey(+result.groups.falseTarget)
        }
        if(result.groups.trueTarget) {
            return lastMonkey.setTrueMonkey(+result.groups.trueTarget)
        }
    }
});

Array.from({length: 20}).forEach(() => {
    monkeys.map(monkey => {
        monkey.throwItems();
    })
});
const [top, next, ...rest] = monkeys.map(monkey => monkey.getInspected()).sort((a,b) => b-a);
const task1 = top*next;

console.log('task1 -> ', task1);
