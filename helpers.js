const fs = require('fs');

/**
 * Find the greatest common devisor of two integers
 * https://www.w3resource.com/javascript-exercises/javascript-math-exercise-9.php
 */
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
 * Algorithm to find the modulo of a fraction.
 * @param {number} numerator 
 * @param {number} denominator 
 * @param {number} n 
 */
function modulo_of_fraction (numerator, denominator, n) {
    if (denominator === 0) return 0;

    for (let t = 1; t <= n; t++) {
        if (mod(t*denominator, n) === mod(numerator, n)) return t
    }
    return 'failed';
}

/**
 * Computes x modulo n, also for negative numbers, as the '%' operator in JavaScript is not an implementation
 * of the mathematical operation known as modulo.
 * https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
 * @param {number} x 
 * @param {number} n 
 */
const mod = (x, n) => (x % n + n) % n

/**
 * Store key pair to file
 * @param {number} private_key 
 * @param {array} public_key 
 */
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

/**
 * Get key pair from file
 */
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

/**
 * Check if string is valid JSON
 * @param {string} str 
 */
function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


module.exports.gcd = gcd;
module.exports.modulo_of_fraction = modulo_of_fraction;
module.exports.mod = mod;
module.exports.store_keys = store_keys;
module.exports.get_keys = get_keys;
module.exports.isJson = isJson;