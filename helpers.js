const fs = require('fs');

/**
 * Find the greatest common devisor of two integers
 * http://pages.pacificcoast.net/~cazelais/euclid.html
 */
function gcd_old (a, b)
{ 
    console.log(a, b)
    if (b == 0) return a

    return gcd(b, a % b)
}

function gcd_old2 (a, b) {
    if (a === 0) return b
    if (b === 0) return a
    // a = m*q + r
    const m = a%b
    const r = a - b
    return gcd(m, r)
}

function gcd_forever (a, b) {
    // b = q*a + r
    console.log('a, b: ', a, b)
    var q, r;
    while (a !== 0) {
        q = Math.floor(b/a);
        r = b%a

        a = b
        b = r
    }
    console.log(b)
    return b
}

function gcd (a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return [NaN, NaN, NaN]
    }
    
    if (a === Infinity || a === -Infinity || b === Infinity || b === -Infinity) {
      return [Infinity, Infinity, Infinity];
    }
    // Checks if a or b are decimals
    if ((a % 1 !== 0) || (b % 1 !== 0)) {
      return new Error('a and/or b are decimals');
    }
    var signX = (a < 0) ? -1 : 1,
      signY = (b < 0) ? -1 : 1,
      x = 0,
      y = 1,
      u = 1,
      v = 0,
      q, r, m, n;
    a = Math.abs(a);
    b = Math.abs(b);
  
    // b = q*a + r
    while (a !== 0) {
      q = Math.floor(b / a);
      r = b % a;
      m = x - u * q;
      n = y - v * q;

      // Swap order
      b = a;
      a = r;
      x = u;
      y = v;
      u = m;
      v = n;
    }
    return b;//[b, signX * x, signY * y];
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
    console.log('modulo of fraction: ', numerator, denominator, n)
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