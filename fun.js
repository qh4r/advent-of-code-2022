/**
 * Dany jest string domino "1-2,2-1,1-2,3-1,2-3,3-4,4-3,3-2,2-1,1-1,1-1,1-2,2-1,1-2,3-2,1-2".
 * Napisz funkcję, która zwróci długość najdłuższego, poprawnego ciągu domino.
 * Resultat: W tym przypadku ten ciąg to "2-3,3-4,4-3,3-2,2-1,1-1,1-1,1-2,2-1,1-2", a jego długość to 10
 */

function findMax(input) {
    const res = input.split(',').reduce((acc, piece) => {
        const [nextStart] = piece.split('-')
        acc.chains = acc.chains.map((chain, i) => {
            const last = chain[chain.length - 1];
            const [_, lastEnd] = last.split('-');
            if(lastEnd === nextStart) {
                return [...chain, piece]
            } else {
                return null;
            }
        }).filter(x => !!x);
        acc.chains.sort((a,b) => b.length - a.length);
        acc.chains.push([piece]);
        if(acc.chains[0].length > acc.max) {
            acc.max = acc.chains[0].length;
        }
        return acc;
    }, {
        max: -Infinity,
        chains: []
    })

    return res.max;
}

console.log(findMax('1-2,2-1,1-2,3-1,2-3,3-4,4-3,3-2,2-1,1-1,1-1,1-2,2-1,1-2,3-2,1-2'));
