const data = require('fs').readFileSync('data7.txt').toString().trim().split('\n')
function makeDir(name, parent) {
    const _name = name;
    const _parent = parent;
    let _weight = 0;
    const _children = [];

    return {
        match: (name) => _name === name,
        addW: (w) => _weight += w,
        getW: () => _weight,
        pushCh: (ch) => _children.push(ch),
        goUp: () => _parent,
        matchChild: (name) => _children.find(c => c.match(name)),
        getChildren: () => _children,
        getName: () => _name
    }
}

const root = makeDir('root')
let current = root;
const dirs = [];

function handleMatch(groups) {
    if(groups.root) {
        current = root; return;
    }
    if(groups.dir) {
        if(!current.matchChild(groups.dir)) {
            const dir = makeDir(groups.dir, current);
            dirs.push(dir)
            current.pushCh(dir);
        }
        return;
    }
    if(groups.cd) {
        const next = current.matchChild(groups.cd)
        if(next)
            current = next;
        return;
    }
    if(groups.file) {
        current.addW(+groups.file); return;
    }
    if(groups.up) {
        if(current.goUp())
            current = current.goUp();
        return;
    }
    if(groups.ls) {
        return;
    }
}

function weightOfDir(dir) {
    let weight = dir.getW();
    const childrenWeight = dir.getChildren().reduce((sum, child) => {
        return sum + weightOfDir(child);
    }, 0);
    return weight + childrenWeight;
}

data.map(line => {
    const cmdRx = /^(\$\s(cd\s((?<cd>\w+)|(?<root>\/)|(?<up>\.\.)))|(\$\s(?<ls>ls)))|(dir\s(?<dir>\w+))|(?<file>\d+).*$/
    const res = cmdRx.exec(line)
    if(!res.groups) throw new Error(`broken -> ${line}`)
    handleMatch(res.groups)
})

const dirsWeights = dirs.map(dir => {
    const w = weightOfDir(dir);
    return w;
})

const task1 = dirsWeights.filter(dir => dir < 100000).reduce((sum, x) => sum + x, 0)

console.log('task1 ->', task1);

const avSpace = 70000000;
const needed = 30000000;
const totalFree = avSpace - weightOfDir(root);
const sorted = dirsWeights.sort((a,b) => a-b)
const task2 = sorted.find(x => {
    return totalFree + x >= needed
})

console.log('task2 -> ', task2);
