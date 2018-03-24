const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json()
const urlEncodedParser = bodyParser.urlencoded({ extended: false })

const cookie = 'rxuz2ylq3s1p4uoq';
const joke = `There used to be a street named after Chuck Norris, but it was changed because nobody crosses Chuck Norris and lives.`;

const pbkdf2Config = {
    salt: 'salt',
    iterations: 300000,
    size: 32,
    hash: 'sha512'
}
const challengeEncryptConfig = {
    mode: 'aes-256-cbc',
    iv: 'f173d50e49b1bcff66b5f113da6bd733'
}
const plaintextEncryptConfig = {
    mode: 'aes-256-ecb',
    key: 'f273d50e49b1bcff66b5f113da6bd734f173d50e59b1bcff66b5f213da6bd733'
}

encrypt = (mode, plaintext, key, iv) => {
    const padding = true;
    const inputEncoding = 'utf8';
    const outputEncoding = 'hex';

    iv = iv ? Buffer.from(iv, 'hex') : Buffer.alloc(0);

    const cipher = crypto.createCipheriv(mode, Buffer.from(key, 'hex'), iv);
    cipher.setAutoPadding(padding);
    let ciphertext = cipher.update(plaintext, inputEncoding, outputEncoding);
    ciphertext += cipher.final(outputEncoding);

    return {
        iv: iv.toString(outputEncoding),
        ciphertext
    };
}

app.get('/', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });

    crypto.pbkdf2(cookie, pbkdf2Config.salt, pbkdf2Config.iterations, pbkdf2Config.size, pbkdf2Config.hash, (err, key) => {
        const challenge = encrypt(challengeEncryptConfig.mode, joke, key, challengeEncryptConfig.iv);
        response.end(JSON.stringify(challenge));
    });
});

processRequest = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });

    const { plaintext } = request.body;
    const { ciphertext } = encrypt(plaintextEncryptConfig.mode, plaintext.concat(cookie), plaintextEncryptConfig.key);

    response.end(JSON.stringify({ ciphertext }));
}

app.post('/', urlEncodedParser, (request, response) => processRequest(request, response));
app.post('/ecb', jsonParser, (request, response) => processRequest(request, response));
app.listen(80);
