const fs = require('fs');
const http = require('http');
const crypto = require('crypto');
const { decryptChallenge } = require('./decrypt');
const { prettyLogSuccess, prettyLogError } = require('./logger');
const { getRequest, postRequest } = require('./utils');
const { RSA, diffieHellman, getChallenge: getChallengeConfig } = require('./config');

const clientRSA = {
    publicKey: fs.readFileSync('public.pem'),
    privateKey: fs.readFileSync('private.pem')
}

const diffieHellmanService = crypto.getDiffieHellman('modp15');
diffieHellmanService.generateKeys();

const clientDiffieHellman = {
    publicKey: diffieHellmanService.getPublicKey('hex')
}

getServerRSAPublicKey = () => getRequest(RSA.getServerPublicKey);

postClientRSAPublicKey = (key) => {
    const data = JSON.stringify({ key });
    return postRequest(data, RSA.postClientPublicKey);
}

postClientDiffieHellmanPublicKey = (key, signature) => {
    const data = JSON.stringify({ key, signature });
    return postRequest(data, diffieHellman.postClientPublicKey);
}

getChallenge = () => getRequest(getChallengeConfig);

digitallySignWithPrivateRSAKey = (elementToSign) => {
    const sign = crypto.createSign('RSA-SHA256');
    sign.write(elementToSign);
    sign.end();
    return sign.sign(clientRSA.privateKey, 'hex');
}

verifySignatureWithPublicRSAKey = (publicKey, signature, content) => {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.write(content);
    verify.end();
    return verify.verify(Buffer.from(publicKey, 'hex'), signature, 'hex');
}

(async () => {
    const { key: serverRSAPublicKey } = await getServerRSAPublicKey();
    await postClientRSAPublicKey(clientRSA.publicKey.toString('hex'));
    await postClientDiffieHellmanPublicKey(clientDiffieHellman.publicKey, digitallySignWithPrivateRSAKey(clientDiffieHellman.publicKey));

    const { key, signature, challenge } = await getChallenge();
    const isSignatureOk = verifySignatureWithPublicRSAKey(serverRSAPublicKey, signature, key + clientDiffieHellman.publicKey.toString('hex'));

    if(isSignatureOk)
    {
        const sharedSecretForKeyDerivation = diffieHellmanService.computeSecret(key, 'hex');
        const plaintext = await decryptChallenge(sharedSecretForKeyDerivation, challenge);
        prettyLogSuccess('Joke decrypted', plaintext);
    }
    else
    {
        prettyLogError('Signature invalid', 'Signature of Diffie Hellman public keys is invalid');
    }
})();
