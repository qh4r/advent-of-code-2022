const lines = require('fs').readFileSync('data16.txt').toString().trim().split('\n');

const relevantValves = [];

const valves = lines.reduce((valves, line) => {
    const regex = /.+?(?<valve>[A-Z]+).+rate=(?<rate>\d+)[^A-Z]+(?<leadsTo>[A-Z,?\s]+)/;
    const match = regex.exec(line);
    if (match) {
        const {valve, rate, leadsTo} = match.groups;
        const leads = leadsTo.split(', ')
        const isRelevant = +rate > 0
        valves[valve] = {
            name: valve,
            rate: +rate,
            leads,
            isRelevant,
        }
        if (isRelevant) relevantValves.push(valves[valve]);
    }
    return valves;
}, {});

[valves['AA'], ...relevantValves].forEach((valve) => {
    console.log(valve.name)
    const travelCosts = relevantValves.reduce((out, relevantValve) => {
        const road = [{
            valveName: valve.name,
            weight: 0,
            rate: valve.rate,
            visited: [],
        }];
        while (true) {
            const position = road.shift();
            if (position.valveName === relevantValve.name) {
                position.weight += 1;
                out[relevantValve.name] = position;
                return out;
            } else {
                valves[position.valveName].leads.forEach(lead => {
                    if (position.visited.findIndex(name => name === lead) === -1) {
                        road.push({
                            valveName: valves[lead].name,
                            rate: valves[lead].rate,
                            weight: position.weight + 1,
                            visited: [...position.visited, lead],
                        })
                    }
                })
            }
        }
    }, {});

    valve.travelCosts = travelCosts;
});

const fakeValve = {
    valveName: 'fake',
    weight: 0,
    rate: 0,
}

fakeValve.travelCosts = relevantValves.reduce((out, valve) => {
    out[valve.valveName] = fakeValve;
    return out;
}, {});

const totalTime = 26;

const processPlayer = ({valve, pressurePerTurn, steps, done}, nextValveName, toVisit) => {
    if (done || !nextValveName) {
        return {
            valve,
            pressurePerTurn,
            steps,
            done,
        }
    }
    const nextValve = valves[nextValveName];
    const nextValveWeight = valve.travelCosts[nextValveName].weight;
    if ((toVisit.length === 0) || (steps + nextValveWeight >= (totalTime - 1))) {
        return {
            valve: valve,
            steps: totalTime,
            pressurePerTurn: pressurePerTurn,
            done: true,
        }
    } else {
        const newSteps = steps + nextValveWeight;
        const newPressurePerTurn = [...pressurePerTurn];
        newPressurePerTurn[newSteps] = nextValve.rate;

        return {
            valve: nextValve,
            steps: newSteps,
            pressurePerTurn: newPressurePerTurn,
            done: false,
        }
    }
}

const progressPath = ({valveStart, nextValveNames, elephant, human, toVisit}, end = false) => {
    if (valveStart) {
        return {
            elephant: {
                valve: valveStart,
                pressurePerTurn: [],
                steps: 0,
                done: false,
            },
            human: {
                valve: valveStart,
                pressurePerTurn: [],
                steps: 0,
                done: false,
            },
            toVisit: relevantValves.map(v => v.name),
            done: false
        }
    }

    const newHuman = processPlayer(human, nextValveNames[0], toVisit);
    const newElephant = processPlayer(elephant, nextValveNames[1], toVisit);

    return {
        elephant: newElephant,
        human: newHuman,
        toVisit: toVisit.filter(v => !nextValveNames.includes(v)),
        done: elephant.done && human.done,
    }
}

const paths = [progressPath({valveStart: valves['AA']})];
let settledPaths = [];
let maxPressure = 0;

const clearSettled = () => {
    settledPaths.forEach(path => {
        let currentPressure = 0;
        let currentPerTurn = 0;
        for (let i = 0; i <= totalTime; i++) {
            currentPressure = currentPressure + currentPerTurn;
            if (path.elephant.pressurePerTurn[i]) {
                currentPerTurn = currentPerTurn + path.elephant.pressurePerTurn[i];
            }
            if (path.human.pressurePerTurn[i]) {
                currentPerTurn = currentPerTurn + path.human.pressurePerTurn[i];
            }
        }
        if(maxPressure < currentPressure) {
            maxPressure = currentPressure;
        }
    });
    settledPaths = []
}


const checkDone = (res) => {
    if (res.done) {
        settledPaths.push(res)
    } else {
        paths.push(res);
    }
}

while (paths.length > 0) {
    if(settledPaths.length > 1000) {
        clearSettled();
        console.log(paths.length,'max',maxPressure);
    }
    const currentPath = paths.shift();
    if (currentPath.toVisit.length > 0) {
        if (currentPath.toVisit.length === 1) {
            const relevantValveName = currentPath.toVisit[0];
            if ((currentPath.elephant.valve.travelCosts[relevantValveName].weight > (totalTime - currentPath.elephant.steps))
                && (currentPath.human.valve.travelCosts[relevantValveName].weight > (totalTime - currentPath.human.steps))) {
                settledPaths.push({
                    ...currentPath,
                });
            } else {
                if ((currentPath.elephant.valve.travelCosts[relevantValveName].weight > (totalTime - currentPath.elephant.steps))) {
                    checkDone(progressPath({
                        ...currentPath,
                        nextValveNames: [relevantValveName, undefined],
                    }))
                } else {
                    checkDone(progressPath({
                        ...currentPath,
                        nextValveNames: [undefined, relevantValveName],
                    }))
                }
            }
        }
        currentPath.toVisit.forEach(relevantValveName => {
            currentPath.toVisit.forEach(relevantValveName2 => {
                if (relevantValveName !== relevantValveName2) {
                    if ((currentPath.elephant.valve.travelCosts[relevantValveName].weight > (totalTime - currentPath.elephant.steps))
                        && (currentPath.human.valve.travelCosts[relevantValveName].weight > (totalTime - currentPath.human.steps))) {
                        settledPaths.push({
                            ...currentPath,
                        });
                    } else {
                        checkDone(progressPath({
                            ...currentPath,
                            nextValveNames: [relevantValveName, relevantValveName2],
                        }));
                    }
                }
            })
        })
    } else {
        settledPaths.push({
            ...currentPath,
            done: true,
        });
    }
}

clearSettled();

console.log(maxPressure);

// THIS FAILED - but

