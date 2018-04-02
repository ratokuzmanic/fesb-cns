const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cookie = 'nhyZ64MxQ71oAAd9';
const joke = `Chuck Norris once kicked a horse in the chin. Its descendants today are known as giraffes.`;

const pbkdf2Config = {
    salt: 'salt',
    iterations: 300000,
    size: 32,
    hash: 'sha512'
}
const challengeEncryptConfig = {
    mode: 'aes-256-cbc',
    iv: 'f173d40e49b1bcfd66b5f113da6bd733'
}
const plaintextEncryptConfig = {
    mode: 'aes-256-ecb',
    key: 'f273d50e49b1bcff66b5f113da6bd724f173d50e59b1bcaf66b5f223da6bd733'
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

app.get('/ecb/challenge', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });

    crypto.pbkdf2(cookie, pbkdf2Config.salt, pbkdf2Config.iterations, pbkdf2Config.size, pbkdf2Config.hash, (err, key) => {
        const challenge = encrypt(challengeEncryptConfig.mode, joke, key, challengeEncryptConfig.iv);
        response.end(JSON.stringify(challenge));
    });
});

app.post('/ecb', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });

    const { plaintext } = request.body;
    const { ciphertext } = encrypt(plaintextEncryptConfig.mode, plaintext.concat(cookie), plaintextEncryptConfig.key);

    response.end(JSON.stringify({ ciphertext }));
});

app.listen(80);
