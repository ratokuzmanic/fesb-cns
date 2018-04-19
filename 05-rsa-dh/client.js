const fs = require('fs');
const http = require('http');
const crypto = require('crypto');
const config = require('./config.js');

const clientRSAPublic = fs.readFileSync('public.pem');
const clientRSAPrivate = fs.readFileSync('private.pem');
const DH = crypto.getDiffieHellman('modp15');
DH.generateKeys();
const DH_PuK = DH.getPublicKey('hex');

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

postClientDHPublicKey = () =>
    new Promise((resolve, reject) => {        
        const sign = crypto.createSign('RSA-SHA256');
        sign.write(DH_PuK);
        sign.end();
        signature = sign.sign(clientRSAPrivate, 'hex');

        const data = JSON.stringify({ key: DH_PuK, signature: signature });

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

function decrypt(
        mode, 
        key, 
        ciphertext, 
        iv=Buffer.alloc(16), 
        padding=true,
        inputEncoding='hex',
        outputEncoding='utf8' 
    ) {
        const decipher = crypto.createDecipheriv(mode, key, iv)
        decipher.setAutoPadding(padding)
        let plaintext = decipher.update(ciphertext, inputEncoding, outputEncoding)
        plaintext += decipher.final(outputEncoding)
    
        return { plaintext }
    }

(async () => {
    const { key: serverPublicKey } = await getServerRSAPublicKey();
    const response = await postClientRSAPublicKey(Buffer.from(clientRSAPublic).toString('hex'));
    const responseDH = await postClientDHPublicKey();
    const { key, challenge } = await getChallenge();
 
    const sharedKey = DH.computeSecret(key, 'hex');
    const derivedKey = crypto.pbkdf2Sync(sharedKey, 'ServerClient', 1, 32, 'sha512');
    const { plaintext } = decrypt('aes-256-ctr', derivedKey, challenge.ciphertext);
    console.log(plaintext);
})();
