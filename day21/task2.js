(async function () {
    const lines = require('fs').readFileSync('data21.txt').toString().trim().split('\n');
    let searchNumber = 0;
    let addition = true;
    let diff = 1000000000000;
    while (true) {
        const promises = {};
        const fakeTriggers = {};

        const hasPromise = (name) => {
            return !!promises[name];
        }

        const makeFakePromise = (name) => {
            let resolver;
            const promise = new Promise((res) => {
                resolver = res;
            });
            promises[name] = promise;
            fakeTriggers[name] = resolver;
            return {resolver, promise}
        }

        const makePromise = ({name, number, arg1, arg2, operator}) => {
            if (number) {
                if (promises[name]) {
                    fakeTriggers[name](Promise.resolve(name === 'humn' ? searchNumber : +number));
                } else {
                    promises[name] = Promise.resolve(name === 'humn' ? searchNumber : +number);
                }
            } else if (arg1) {
                if (!hasPromise(arg1)) makeFakePromise(arg1);
                if (!hasPromise(arg2)) makeFakePromise(arg2);

                const all = Promise.all([promises[arg1], promises[arg2]]).then((result => {
                    const count = new Function("a", `b`, `${name === 'root' ? 'console.log("inside", a, b);' : ''} return a ${name === 'root' ? '-' : operator} b`);
                    return count(result[0], result[1]);
                }));

                if (promises[name]) {
                    fakeTriggers[name](all);
                } else {
                    promises[name] = all;
                }
            }
        }

        lines.map(line => {
            const regex = /^(?<name>[^:]+):\s((?<number>\d+)|((?<arg1>\w+)\s(?<operator>[+-\/*])\s(?<arg2>\w+)))/
            const match = regex.exec(line);
            if (match.groups) {
                makePromise(match.groups);
            }
        })
        const res = await promises['root'];
        if (res > 0) {
            if (!addition) {
                addition = true;
                diff = Math.floor(diff / 2)
            }
        } else if (res < 0) {
            if (addition) {
                addition = false;
                diff = Math.floor(diff / 2)
            }
        } else if (res === 0) {
            console.log('task2 ->', searchNumber);
            break;
        }
        searchNumber += addition ? +diff : -diff;
    }
})()

