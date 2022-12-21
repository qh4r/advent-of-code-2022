const lines = require('fs').readFileSync('data21.txt').toString().trim().split('\n')

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
    if(number) {
        if(promises[name]) {
            fakeTriggers[name](Promise.resolve(+number));
        } else {
            promises[name] = Promise.resolve(+number);
        }
    } else if (arg1) {
        if(!hasPromise(arg1)) makeFakePromise(arg1);
        if(!hasPromise(arg2)) makeFakePromise(arg2);

        const all = Promise.all([promises[arg1], promises[arg2]]).then((result => {
            const count = new Function("a", `b`,`return a ${operator} b`);
            return count(result[0], result[1]);
        }));

        if(promises[name]) {
            fakeTriggers[name](all);
        } else {
            promises[name] = all;
        }
    }
}

lines.map(line => {
    const regex = /^(?<name>[^:]+):\s((?<number>\d+)|((?<arg1>\w+)\s(?<operator>[+-\/*])\s(?<arg2>\w+)))/
    const match = regex.exec(line);
    if(match.groups) {
        makePromise(match.groups);
    }
})

promises['root'].then(res => console.log('task1 ->', res));
