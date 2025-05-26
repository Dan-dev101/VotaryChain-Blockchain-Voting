const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

function generateKeyPair(){
    const key = ec.genKeyPair();
    return {
        publicKey: key.getPublic('hex'), //This is voter ID (public key)
        privateKey: key.getPrivate('hex') // This is private ballot (private key)
    };
}

module.exports = generateKeyPair;

