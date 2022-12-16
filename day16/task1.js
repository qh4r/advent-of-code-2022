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

[valves['AA'],...relevantValves].forEach((valve) => {
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
                    if(position.visited.findIndex(name => name === lead) === -1) {
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

const totalTime = 30

const progressPath = ({valve, nextValveName, steps, currentPressure, pressurePerTurn, toVisit}, end = false) => {
    if (!nextValveName) {
        return {
            valve: valve,
            steps: 0,
            pressurePerTurn: 0,
            currentPressure: 0,
            toVisit: relevantValves.map(v => v.name),
        }
    }

    const nextValve = valves[nextValveName];
    const nextValveWeight = valve.travelCosts[nextValveName].weight;
    if (end || (toVisit.length === 0) || (steps + nextValveWeight >= (totalTime-1))) {
        const newPressure = currentPressure + pressurePerTurn * (totalTime - steps);
        return {
            valve: undefined,
            steps: totalTime,
            pressurePerTurn: pressurePerTurn,
            currentPressure: newPressure,
            toVisit: [],
        }
    } else {
        const newPressure = currentPressure + pressurePerTurn * nextValveWeight;
        const newPressurePerTurn = pressurePerTurn + nextValve.rate;
        return {
            valve: nextValve,
            steps: steps + nextValveWeight,
            pressurePerTurn: newPressurePerTurn,
            currentPressure: newPressure,
            toVisit: toVisit.filter(v => v !== nextValveName),
        }
    }
}

const paths = [progressPath({valve: valves['AA']})];
const settledPaths = [];

while (paths.length > 0) {
    const currentPath = paths.shift();

    if (currentPath.steps === totalTime) {
        settledPaths.push(currentPath);
    } else {
        console.log(paths.length, settledPaths.length)
        if(currentPath.toVisit.length > 0) {
            currentPath.toVisit.forEach(relevantValveName => {
                if(currentPath.valve.travelCosts[relevantValveName].weight < (totalTime - currentPath.steps)) {
                    paths.push(progressPath({
                        ...currentPath,
                        nextValveName: relevantValveName,
                    }));
                } else {
                    const newPressure = currentPath.currentPressure + currentPath.pressurePerTurn * (totalTime - currentPath.steps);
                    settledPaths.push({
                        currentPressure: newPressure,
                    });
                }
            })
        } else {
            paths.push(progressPath({
                ...currentPath,
                nextValveName: currentPath.valve.name,
            }, true));
        }
    }
}
settledPaths.sort((pathA, pathB) => (pathB.currentPressure - pathA.currentPressure))
console.log(settledPaths[0]);
