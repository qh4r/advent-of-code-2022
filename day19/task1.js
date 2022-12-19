const lines = require('fs').readFileSync('data19.txt').toString().trim().split('\n');

const robotTypes = ['clay', 'ore', 'obsidian', 'geode'];

const parseCostForType = (type, {
    clayRobotOreCost, geodeRobotObsidianCost, geodeRobotOreCost,
    obsidianRobotClayCost, obsidianRobotOreCost, oreRobotOreCost
}) => {
    switch (type) {
        case "clay":
            return {
                ore: +clayRobotOreCost,
                clay: 0,
                obsidian: 0,
                geode: 0,
            };
        case "ore":
            return {
                ore: +oreRobotOreCost,
                clay: 0,
                obsidian: 0,
                geode: 0,
            };
        case "obsidian": {
            return {
                ore: +obsidianRobotOreCost,
                clay: +obsidianRobotClayCost,
                obsidian: 0,
                geode: 0,
            }
        }
        case "geode": {
            return {
                ore: +geodeRobotOreCost,
                clay: 0,
                obsidian: +geodeRobotObsidianCost,
                geode: 0,
            }
        }
    }
}

const makeFactory = (factoryData) => {
    const {costs, maxCosts} = robotTypes.reduce((out, type) => {
        const parsedData = parseCostForType(type, factoryData);
        out.costs[type] = parsedData;
        robotTypes.forEach(robotType => {
            out.maxCosts[robotType] = Math.max(parsedData[robotType], out.maxCosts[robotType]);
        })
        return out;
    }, {
        costs: {},
        maxCosts: {
            ore: 0,
            clay: 0,
            obsidian: 0,
            geode: Infinity,
        },
    });

    const blueprintId = factoryData.blueprintId;

    return {
        blueprintId,
        robotCosts: costs,
        maxCosts,
        canMakeRobot: (robotType, resources, activeRobots, skippedPossibilities) => {
            if(skippedPossibilities.has(robotType)) {
                return false;
            }
            if(robotType === '_') {
                if(robotTypes.every(robotType => resources[robotType] >= maxCosts[robotType])) {
                    return false;
                }
                return true;
            }
            if(activeRobots[robotType] >= maxCosts[robotType]) {
                return false;
            }
            return robotTypes.reduce((out, resourceType) => {
                return out && resources[resourceType] - costs[robotType][resourceType] >= 0;
            }, true);
        }
    }
}

const processStep = (step, resources, activeRobots, robotCosts) => {
    const newActiveRobots = {...activeRobots};
    const newResources = {...resources};

    if (step !== '_') {
        robotTypes.forEach(type => {
            newResources[type] = newResources[type] - robotCosts[step][type];
        })
        newActiveRobots[step] += 1;
    }
    return {
        resources: newResources,
        activeRobots: newActiveRobots,
    }
}

const makePlan = (planSoFar, factory, nextStep, skippedPossibilities) => {
    if (!planSoFar) {
        const steps = [];
        const {resources, activeRobots} = robotTypes.reduce((out, type) => {
            out.resources[type] = 0;
            out.activeRobots[type] = type === 'ore' ? 1 : 0;
            return out;
        }, {
            resources: {},
            activeRobots: {},
        });

        return {
            steps,
            resources,
            activeRobots,
            factory,
            skippedPossibilities: new Set(),
        }
    }

    const steps = [...planSoFar.steps, nextStep];
    const {resources, activeRobots} = processStep(nextStep, planSoFar.resources, planSoFar.activeRobots, factory.robotCosts);

    robotTypes.forEach(type => {
        resources[type] = resources[type] + planSoFar.activeRobots[type];
    })

    return {
        steps,
        resources,
        activeRobots,
        factory,
        skippedPossibilities
    }
}

const makeZeroMap = () => new Map(Array.from({length: 24}).map((_, i) => [i, 0]));

const bestPlans = lines.map((line,li) => {
    const regex = /Blueprint\s(?<blueprintId>\d+).+?ore\srobot\scosts\s(?<oreRobotOreCost>\d+).+?clay\srobot\scosts\s(?<clayRobotOreCost>\d+).+?obsidian\srobot\scosts\s(?<obsidianRobotOreCost>\d+).+?(?<obsidianRobotClayCost>\d+).+?geode\srobot\scosts\s(?<geodeRobotOreCost>\d+).+?(?<geodeRobotObsidianCost>\d+)/
    const match = regex.exec(line);
    if (match) {
        const factory = makeFactory({
            ...match.groups
        });
        const maxGeodesMap = makeZeroMap();
        const maxGeodeRobotsMap = makeZeroMap();

        const completePlans = [];
        const plans = [makePlan(null, factory)];
        const segregatePlans = (plan) => {
            const timeLeft = (24 - plan.steps.length);
            if(plan.steps.length > 0) {
                if(plan.resources.geode > maxGeodesMap.get(plan.steps.length - 1)) {
                    maxGeodesMap.set(plan.steps.length - 1, plan.resources.geode);
                    maxGeodeRobotsMap.set(plan.steps.length - 1, plan.activeRobots.geode);
                }
            }
            if((plan.resources.geode + (plan.activeRobots.geode * timeLeft) < maxGeodesMap.get(plan.steps.length - 2) + maxGeodeRobotsMap.get(plan.steps.length - 2) * (timeLeft + 1)) ||
                (plan.resources.geode + (plan.activeRobots.geode * timeLeft) < maxGeodesMap.get(plan.steps.length - 1) + maxGeodeRobotsMap.get(plan.steps.length - 1) * timeLeft)) {
                return;
            }
            if(plan.steps.length > 23) {
                completePlans.push(plan);
            } else {
                plans.push(plan);
            }
        }
        while(plans.length > 0) {
            const plan = plans.shift();
            if(plan.steps.length > 23) {
                completePlans.push(plan);
                continue;
            }
            const possibleSteps = ['_', ...robotTypes].filter(robotType => plan.factory.canMakeRobot(robotType, plan.resources, plan.activeRobots, plan.skippedPossibilities));
            [...(possibleSteps.length === 5 ? possibleSteps.filter(s => s !== '_') : possibleSteps)].forEach(step => {
                if(step === "_") {
                    const newSkipped = new Set([...plan.skippedPossibilities, ...possibleSteps.filter(s => s !== '_')]);
                    segregatePlans(makePlan(plan, plan.factory, step, newSkipped));
                } else {
                    segregatePlans(makePlan(plan, plan.factory, step, new Set()));
                }
            })
        }

        completePlans.sort((planA, planB) => planB.resources.geode - planA.resources.geode);
        console.log(completePlans[0]);
        return completePlans[0];
    }
})
console.log("task1 -> ", bestPlans.reduce((sum, plan) => {
    return sum + plan.resources.geode * plan.factory.blueprintId;
}, 0));

