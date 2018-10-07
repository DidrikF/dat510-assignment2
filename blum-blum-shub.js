const { gcd, mod } = require('./helpers')

module.exports  = function blum_blum_shub (p, q, seed) {
    // need to make the seed relative prime to n = p*q
    // if gcd(n, p*q) is 1, then they are relatively prime
    const n = p*q;
    let greatestCommonDevisor = gcd(seed, n);
    
    while (greatestCommonDevisor !== 1) {
        seed++
        greatestCommonDevisor = gcd(seed, n);
    }

    console.log(greatestCommonDevisor, seed)

    // BBS algorithm
    const X = [];
    const B = [];
    X[0] = mod(Math.pow(seed, 2), n);
    for (let i = 1; i <= 128; i++) {
        X[i] = mod(Math.pow(X[i-1], 2), n)
        B[i] = mod(X[i], 2)
    }

    return B
}

function is_prime () {

}