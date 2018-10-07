const { range } = require('lodash');

/**
 * Find the greatest common devisor of two integers
 * http://pages.pacificcoast.net/~cazelais/euclid.html
 */
function gcd (a, b)
{ 
    if (b == 0) return a

    return gcd(b, a % b)
}


/**
 * Find the gcd also of fractions
 */
function extendedEuclideanAlgorithm () {


}

/**
 * //// Replace modulo_of_fraction...
 * @param {*} a 
 * @param {*} b 
 */
function eea (a,b) { 
    if (b == 0) {
        return [1, 0, a]
    } else {
        temp = xgcd(b, a % b)
        x = temp[0]
        y = temp[1]
        d = temp[2]
        return [y, x-y*Math.floor(a/b), d]
    }
}

function modulo_of_fraction (numerator, denominator, n) {
    //const tests = range(1, denominator);
    // console.log(numerator, denominator, n)
    for (let t = 1; t <= n; t++) {
        if (mod(t*denominator, n) === mod(numerator, n)) return t
    }

    return 'failed';
}

/**
 * Computes x modulo n, also for negative numbers, as the '%' operator in JavaScript is not an implementation
 * of the mathematical operation known as modulo.
 * @param {number} x 
 * @param {number} n 
 */
const mod = (x, n) => (x % n + n) % n

https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e


function PRNG () {

}

module.exports.gcd = gcd;
module.exports.extendedEuclideanAlgorithm = extendedEuclideanAlgorithm;
module.exports.modulo_of_fraction = modulo_of_fraction;
module.exports.mod = mod;