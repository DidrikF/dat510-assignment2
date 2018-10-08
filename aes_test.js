const crypto = require('crypto');

const key = '01010010011000011010110010010000000101001101111010000010001001100100010111000000111100111000110111001001100101111111111001001100'

const decipher = crypto.createDecipher('aes128', key) 
const encipher = crypto.createCipher('aes128', key)

const cleardata = JSON.stringify({
  test: 'test'
})


let encryptdata = encipher.update(cleardata, 'utf8', 'hex');
encryptdata += encipher.final('hex');


let decoded = decipher.update(encryptdata, 'hex', 'utf8');
decoded += decipher.final('utf8');

console.log(cleardata)
console.log(encryptdata)
console.log(decoded);


