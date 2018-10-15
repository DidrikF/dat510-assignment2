const blum_blum_shub = require('./blum-blum-shub')
const { modulo_of_fraction } = require('./helpers');
const EllipticCurve = require('./elliptic-curve')

/**
 * Modulo of fraction test
 */



/**
 * Blum Blum Shub Tests
 */
console.log('Blum Blum Shub tests:')
const tests  = [
    [383, 503, 192649], // seed is n, gives seed of 192650, which has gcd of 1 with n. Gives: 11111111...
    [383, 503, 385298], // the seed used is the same as the test above, just 192649 (n) higher. Gives: 11111111...
    [383, 503, 1712345642],
    [383, 503, 12],
    [383, 503, 104],
    [383, 503, 137],
    [383, 503, 31],
].forEach(test => {
    console.log(test)
    console.log(blum_blum_shub(...test).join('')+'\n')
})



const groupMembers = [ // a=1, b=1, p=23, cardinality=28, G=[3,10] or some other point in the set
    [5, 4], // Gave cyclic group with lower cardinality, the code produced points that cycled around ofter 5 steps.
    [0,1], 
    [0,22], 
    [1,7], 
    [1,16], 
    [3,10], 
    [3,13], 
    [4, 0],
    //[5, 4],
    [5, 19], // Inverse of the above
    [6, 4],
    [6, 19], // inverse of the above
    [7, 11],
    [7, 12], // inverse of the above
    [9, 7],
    [9, 16], // inverse of the above
    [11, 3],
    [11, 20],
    [12, 4],
    [12, 19],
    [13, 7],
    [13, 16],
    [17, 3],
    [17, 20],
    [18, 3],
    [18, 20],
    [19, 5],
    [19, 18],
    [0, Infinity]
    // Point at infinity is not included
]

const groupMembers2 = [ // a=2, b=2, p=17, G=[5,1] or some other point in the set
    [ 5, 1 ], // if [5,1] is P
    [ 6, 14 ],
    [ 5, 16 ], // then 18P is [5,16], which is the inverse of [5,1]
    [ 16, 13 ],
    [ 0, 6 ],
    [ 13, 7 ],
    [ 7, 6 ],
    [ 7, 11 ],
    [ 13, 10 ],
    [ 6, 3 ],
    [ 10, 6 ],
    [ 3, 1 ],
    [ 9, 16 ],
    [ 0, 11 ],
    [ 16, 4 ],
    [ 9, 1 ],
    [ 3, 16 ],
    [ 10, 11 ],
    [0, Infinity]
    // the 19th element is the point at infinity
]

var EC = new EllipticCurve(2, 2, [5, 1], 17, 19); 
// Alternative parameters to EllipticCurve constructor:
// 2,3,[3,6], 97,5
// 2, 2, [5, 1], 17, 19 (groupMembers2 hold the points of this curve)
// 1, 1, [0, 1], 23, 27 (groupMembers hold the points of this curve)

results = []
let errorMessages = [];


groupMembers2.forEach(member => {
    for (let i = 2; i <= groupMembers2.length*2; i++) {
        EC.currentG = member
        const result = EC.point_multiplication(member, i);
        results.push([member, i , result]);

        let found = false

        for (let i = 0; i < groupMembers2.length; i++) {
            if ((groupMembers2[i][0] === result[0]) && (groupMembers2[i][1] === result[1])) {
                found = true;
            }
        }

        if (found === false) {
            errorMessages.push('Using generator: ' + member + ' and multiplier: ' + i + ' the result: ' + result + ' is not a group member');
        }
    }
})

console.log(results);
console.log(errorMessages);
if (errorMessages.length < 1) {
    console.log(`Only group members was derived when doing point multiplication: c*P, where;
c is some multiplier with value less then cardinality of the set E(a, b) mod p, and
P is a point in the set E(a, b) mod p `)
}


/*
var EC2 = new EllipticCurve(1, 1, [0, 1], 23, 27); 
results = []
errorMessages = []

groupMembers.forEach(member => {
    for (let i = 2; i < groupMembers.length; i++) {
        if (member[1] === 0) continue; // cannot be a generator
        EC2.currentG = member
        const result = EC2.point_addition(member, i);
        results.push([member, i , result]);

        let found = false

        for (let i = 0; i < groupMembers.length; i++) {
            if ((groupMembers[i][0] === result[0]) && (groupMembers[i][1] === result[1])) {
                found = true;
            }
        }

        if (found === false) {
            errorMessages.push('Using generator: ' + member + ' and multiplier: ' + i + ' the result: ' + result + ' is not a group member');
        }
    }
})

console.log(results);
console.log(errorMessages);
if (errorMessages.length < 1) {
    console.log(`Only group members was derived when doing point multiplication: c*P, where;
c is some multiplier with value less then cardinality of the set E(a, b) mod p, and
P is a point in the set E(a, b) mod p `)
}
*/

//_________
var EC2 = new EllipticCurve(1, 1, [0, 1], 23, 27); 
results = []
errorMessages = []

const point = [0, 1]// [0, 1];
const n = 13;

EC2.currentG = point
const result = EC2.point_multiplication(point, n);
results.push([point, n , result]);

let found = false

for (let i = 0; i < groupMembers.length; i++) {
    if ((groupMembers[i][0] === result[0]) && (groupMembers[i][1] === result[1])) {
        found = true;
    }
}

if (found === false) {
    errorMessages.push('Using generator: ' + point + ' and multiplier: ' + n + ' the result: ' + result + ' is not a group member');
}



console.log(results);
console.log(errorMessages);
if (errorMessages.length < 1) {
    console.log(`Only group members was derived when doing point multiplication: c*P, where;
c is some multiplier with value less then cardinality of the set E(a, b) mod p, and
P is a point in the set E(a, b) mod p `)
}


/*
console.log('Double: ', EC2.point_double([5,4]));
console.log('Add: ', EC2.point_add([5,4], [5,4]));
*/