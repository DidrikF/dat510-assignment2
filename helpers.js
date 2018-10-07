const fs = require('fs');

/**
 * Find the greatest common devisor of two integers
 * http://pages.pacificcoast.net/~cazelais/euclid.html
 */
function gcd (a, b)
{ 
    console.log(a, b)
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

// https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e


function store_keys(private_key, public_key) {
    const keys = {
        private_key: private_key,
        public_key: public_key
    }
    try {
        fs.writeFileSync('./keys.txt', JSON.stringify(keys))
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

function get_keys() {
    try {
        const data = fs.readFileSync('./keys.txt');
        const keys = JSON.parse(data);
        return keys
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


module.exports.gcd = gcd;
module.exports.extendedEuclideanAlgorithm = extendedEuclideanAlgorithm;
module.exports.modulo_of_fraction = modulo_of_fraction;
module.exports.mod = mod;
module.exports.store_keys = store_keys;
module.exports.get_keys = get_keys;
module.exports.isJson = isJson;