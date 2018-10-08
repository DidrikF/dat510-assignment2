const blum_blum_shub = require('./blum-blum-shub')
const { modulo_of_fraction } = require('./helpers');
const EllipticCurve = require('./elliptic-curve')

const bbs_test = blum_blum_shub(383, 503, 192649); // seed is n, gives seed of 192650, which has gcd of 1 with n. Gives: 11111111...
console.log(bbs_test.join(''))
console.log(bbs_test.join('').length)
console.log(parseInt(bbs_test.join(''), 2))

const bbs_test2 = blum_blum_shub(383, 503, 385298); // the seed used is the same as the test above, just 192649 (n) higher. Gives: 11111111...
console.log(bbs_test2.join(''))
console.log(bbs_test2.join('').length)
console.log(parseInt(bbs_test2.join(''), 2))


const bbs_test3 = blum_blum_shub(383, 503, 1712345642);
console.log(bbs_test3.join(''))
console.log(bbs_test3.join('').length)
console.log(parseInt(bbs_test3.join(''), 2))



const bbs_test4 = blum_blum_shub(383, 503, 12);
console.log(bbs_test4.join(''))
console.log(bbs_test4.join('').length)
console.log(parseInt(bbs_test4.join(''), 2))


const bbs_test5 = blum_blum_shub(383, 503, 104);
console.log(bbs_test5.join(''))
console.log(bbs_test5.join('').length)
console.log(parseInt(bbs_test5.join(''), 2))


// CLEAN THIS UP, ALL CRYPTO FUNCTIONS SHOULD BE TESTED/DEMONSTRATED HERE!

var EC = new EllipticCurve(1, 1, [0, 1], 23, 27); // 2,3,[3,6], 97,5
var EC2 = new EllipticCurve(2,3,[3,6], 97,5); // 2,3,[3,6], 97,5

console.log(modulo_of_fraction(-3,6,23))

console.log('----Add [3,10] and [9,7]: ', EC.point_add([3,10], [9,7]))

console.log('----Double [9,7]: ', EC.point_double([3,10]))


/*
for (let i = 0; i <= 50; i++) {
    console.log(EC.point_multiplication([0, 1], i))
}

for (let i = 0; i <= 15; i++) {
    
    //console.log(EC2.point_multiplication([3, 10], i))
    console.log(EC.point_multiplication([9, 16], i))
}


console.log(EC.point_multiplication([5, 4], 9))
console.log(EC.point_multiplication([0,1], 12))
*/
console.log(EC.point_multiplication([ 11, 20 ], 4))


const groupMembers = [
    [0,1], 
    [0,22], 
    [1,7], 
    [1,16], 
    [3,10], 
    [3,13], 
    [4, 0],
    [5, 4],
    [5, 19],
    [5, 19],
    [6, 4],
    [6, 19],
    [7, 11],
    [7, 12],
    [9, 7],
    [9, 16],
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
    [19, 18]
]

/*
groupMembers.forEach(member => {
    for (let i = 2; i <= 23; i++) {
        const result = EC.point_multiplication(member, i)
        console.log(member, i , result)
        if (groupMembers.find((el) => { return ((el[0] === result[0]) && (el[1] === result[1])) }) === -1) {
            console.log('Using generator: ' + member + ' and multiplier: ' + i + ' the result: ' + result + ' is not a group member')
        }
    }
})

*/
