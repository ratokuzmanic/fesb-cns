const fs = require('fs');
const http = require('http');
const crypto = require('crypto');
const config = require('./config');
const { decryptChallenge } = require('./decrypt');

const clientRSA = {
    publicKey: fs.readFileSync('public.pem'),
    privateKey: fs.readFileSync('private.pem')
}

const diffieHellmanService = crypto.getDiffieHellman('modp15');
diffieHellmanService.generateKeys();

const clientDiffieHellman = {
    publicKey: diffieHellmanService.getPublicKey('hex')
}

getServerRSAPublicKey = () =>
    new Promise((resolve, reject) => {
        const request = http.request(config.getServerRSAPublicKey, response => {
            let data = '';
            response.on('data', chunk => data += chunk);    
            response.on('end', () => resolve(JSON.parse(data)));
        }); 
        request.end();
    });

postClientRSAPublicKey = (key) =>
    new Promise((resolve, reject) => {
        const data = JSON.stringify({ key });

        const request = http.request(config.postClientRSAPublicKey, response => {
            response.setEncoding('utf8');

            response.on('data', data => resolve(JSON.parse(data)));
            
            response.on('error', error => reject());
        });

        request.write(data);
        request.end();
    });

postClientDHPublicKey = (key, signature) =>
    new Promise((resolve, reject) => {    
        const data = JSON.stringify({ key, signature });

        const request = http.request(config.postClientDHPublicKey, response => {
            response.setEncoding('utf8');

            response.on('data', data => resolve(JSON.parse(data)));
            
            response.on('error', error => reject());
        });

        request.write(data);
        request.end();
    });

getChallenge = () =>
    new Promise((resolve, reject) => {
        const request = http.request(config.getChallenge, response => {
            let data = '';
            response.on('data', chunk => data += chunk);    
            response.on('end', () => resolve(JSON.parse(data)));
        }); 
        request.end();
    });

digitallySignWithPrivateRSAKey = (elementToSign) => {
    const sign = crypto.createSign('RSA-SHA256');
    sign.write(element);
    sign.end();
    return sign.sign(clientRSA.privateKey, 'hex');
}

(async () => {
    const { key: serverRSAPublicKey } = await getServerRSAPublicKey();
    const response = await postClientRSAPublicKey(Buffer.from(clientRSA.publicKey).toString('hex'));
    
    const responseDH = await postClientDHPublicKey(clientDiffieHellman.publicKey, digitallySignWithPrivateRSAKey(clientDiffieHellman.publicKey));

    const { key, challenge } = await getChallenge();
 
    const sharedKey = diffieHellmanService.computeSecret(key, 'hex');
    const plaintext = await decryptChallenge(sharedKey, challenge);
    console.log(plaintext);
})();
