// A rudimentary implementation of Elliptic Curves over Zp
const { modulo_of_fraction, mod, gcd } = require('./helpers')
const blum_blum_shub = require('./blum-blum-shub');

module.exports = class EllipticCurve {
    constructor (a, b, G, p, cardinality) {
        this.EC_expression = 'y^2 = x^3 + ax + b',
        this.a = a;
        this.b = b;
        this.G = G;
        this.p = p;
        this.cardinality = cardinality;
        this.currentG = null;
    }
    /**
     * Generate a symmetric AES key from the other party's public key and your private key.
     * Uses the Blum Blum Shub algorithm to generate the key from the shared point derived
     * from Elliptic Curve point multiplication.
     * @param {array} public_key_of_other 
     * @param {number} private_key 
     */
    generate_symmetric_key (public_key_of_other, private_key) {
        const shared_point = this.point_multiplication(public_key_of_other, private_key);
        let seed = parseInt(shared_point.join(''), 10);
        
        console.log('Generating symmetric key from public key of other: ', public_key_of_other, ' and own private key: ', private_key)
        console.log('Shared point: ', shared_point);
        // need to make the seed relative prime to n = p*q
        // if gcd(n, p*q) is 1, then they are relatively prime
        const p = 383;
        const q = 503;
        const n = p*q;
        let greatestCommonDevisor = gcd(seed, n);
        while (greatestCommonDevisor !== 1) {
            seed++
            greatestCommonDevisor = gcd(seed, n);
        }
        //console.log(greatestCommonDevisor, seed)
        console.log('Parameters to blum blum shub (p, q, seed): ', p, q, seed)
        const bits = blum_blum_shub(p, q, seed);
        return bits.join('');
    }

    /**
     * Generate your public key from your private key using Elliptic Curve point multiplication.
     * @param {number} n 
     */
    generate_public_key (n) {
        return this.point_multiplication(this.G, n)
    }

    /**
     * Perform point multiplication over an elliptic curve using the double and add method.
     * So point multiplication is expressed through point addition and doubling.
     * @param {array} G 
     * @param {number} p
     * @returns {array} final_point
     */
    point_multiplication (G, n) {
        n = mod(n, this.cardinality)
        // if (n=== 0) n = 18;
        if (n === 0) {
            return 0 // every cardinality number of elements
        } else if (n === 1) {
            return G
        } else if (n % 2 === 1) {
            return this.point_add(G, this.point_multiplication(G, n-1)) // Add when n is odd
        } else {
            if (this.isPointAtInfinity(G)) return this.point_multiplication(this.currentG, n-1)
            
            return this.point_multiplication(this.point_double(G), n/2) 
        }
    }

    /**
     * Elliptic Curve point addition calculation
     * @param {array} P 
     * @param {array} Q 
     */
    point_add (P, Q) {
        const [Xp, Yp] = P;
        const [Xq, Yq] = Q;

        if (this.isInverse(P, Q)) {
            return [0, Infinity];
        }


        // console.log(Xp, Yp, Xq, Yq)
        const delta = modulo_of_fraction((Yp-Yq),(Xp-Xq), this.p);
        // console.log('Modulo of fraction (slope): ', delta)
        let Xr = Math.pow(delta, 2) - Xp - Xq;
        let Yr = delta*(Xp - Xr) - Yp;
        Xr = mod(Xr, this.p)
        Yr = mod(Yr, this.p)
        // console.log('Added: ', Xr, Yr)
        return [Xr, Yr];
    }


    /**
     * Elliptic Curve point doubling calculation
     * @param {array} P 
     */
    point_double (P) {
        const [Xp, Yp] = P;

        /*
        if(isPointAtInfinity(P)) {
            return this.point_add(P, this.currentG);
        }
        */

        if (Yp === 0) {
            return [0, Infinity];
        }

        // console.log('P: ', P)
        const delta = modulo_of_fraction((3*Math.pow(Xp, 2) + this.a), (2*Yp), this.p);
        // console.log('Modulo of fraction (slope): ', delta)
        let Xr = Math.pow(delta, 2) - 2*Xp
        let Yr = delta*(Xp - Xr) - Yp;
        Xr = mod(Xr, this.p)
        Yr = mod(Yr, this.p)
        // console.log('Doubled: ', Xr, Yr)
        return [Xr, Yr];
    }

    isPointAtInfinity (P) {
        if ((P[1] === Infinity) || (P[1] === -Infinity)) return true;
        return false;
    }

    isInverse (P, Q) {
        if ((P[0] === Q[0]) && (P[1] !== Q[1])) return true;
        return false
    }
    
}




