const { mod } = require('./helpers')

/**
 * Implementation of the Blum Blum Shub algorithm.
 * Requirements: p and q are primes
 *               p mod 4 = q mod 4 = 3
 *               seed and p*q are relatively prime
 * @param {number} p 
 * @param {number} q 
 * @param {number} seed 
 */
module.exports  = function blum_blum_shub (p, q, seed) {
    const n = p*q;
    const X = [];
    const B = [];
    X[0] = mod(Math.pow(seed, 2), n);
    for (let i = 1; i <= 128; i++) {
        X[i] = mod(Math.pow(X[i-1], 2), n)
        B[i] = mod(X[i], 2)
    }
    return B
}
