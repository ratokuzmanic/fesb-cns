const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json()
const urlEncodedParser = bodyParser.urlencoded({ extended: false })

const cookie = 'aaaaaaaa';

const encryptConfig = {
    mode: 'aes-256-ecb',
    key: 'f273d50e49b1bcff66b5f113da6bd734f173d50e59b1bcff66b5f213da6bd733'
}

encrypt = plaintext => {
    const padding = true;
    const inputEncoding = 'utf8';
    const outputEncoding = 'hex';

    const cipher = crypto.createCipheriv(encryptConfig.mode, Buffer.from(encryptConfig.key, 'hex'), Buffer.alloc(0));
    cipher.setAutoPadding(padding);
    let ciphertext = cipher.update(plaintext, inputEncoding, outputEncoding);
    ciphertext += cipher.final(outputEncoding);

    return ciphertext;
}

processRequest = (request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});

    const { plaintext } = request.body
    const ciphertext = encrypt(plaintext.concat(cookie));

    response.end(ciphertext);
}

app.post('/ecb', jsonParser, (request, response) => processRequest(request, response));
app.post('/dev', urlEncodedParser, (request, response) => processRequest(request, response));
app.listen(80);