// A rudimentary implementation of Elliptic Curves over Zp
const { modulo_of_fraction, mod } = require('./helpers')

module.exports = class EllipticCurve {
    constructor (a, b, G, p, cardinality) {
        this.EC_expression = 'y^2 = x^3 + ax + b',
        this.a = a;
        this.b = b;
        this.G = G;
        this.p = p;
        this.cardinality = cardinality
    }

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
        if (n === 0) {
            return 0
        } else if (n === 1) {
            return G
        } else if (n % 2 === 1) {
            return this.point_add(G, this.point_multiplication(G, n-1)) // Add when n is odd
        } else {
            return this.point_multiplication(this.point_double(G), n/2) 
        }
    }

    // Need to express modulo p 

    point_add (P, Q) {
        const [Xp, Yp] = P;
        const [Xq, Yq] = Q;

        if ((Xp === Xq) && (Yp === -Yq)) {
            // this is the point at infinity (zero element)
            // DONT KNOW WHAT TO DO HERE
            return 0;
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


    point_double (P) {
        const [Xp, Yp] = P;
        const delta = modulo_of_fraction((3*Math.pow(Xp, 2) + this.a), (2*Yp), this.p);
        // console.log('Modulo of fraction (slope): ', delta)
        let Xr = Math.pow(delta, 2) - 2*Xp
        let Yr = delta*(Xp - Xr) - Yp;
        Xr = mod(Xr, this.p)
        Yr = mod(Yr, this.p)
        // console.log('Doubled: ', Xr, Yr)
        return [Xr, Yr];
    }
    
}




