const blum_blum_shub = require('./blum-blum-shub')

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



/*
console.log(modulo_of_fraction(-3,6,23))

console.log('----Add [3,10] and [9,7]: ', EC.point_add([3,10], [9,7]))

console.log('----Double [9,7]: ', EC.point_double([3,10]))



for (let i = 0; i <= 97; i++) {
    console.log(EC.point_multiplication([3, 6], i))
}

*/