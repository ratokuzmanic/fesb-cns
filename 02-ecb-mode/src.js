const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json()
const urlEncodedParser = bodyParser.urlencoded({ extended: false })

const ECB_COOKIE = 'aaaaaaaa';

function encrypt( 
    mode,
    plaintext, 
    iv=Buffer.alloc(0), 
    padding=true,
    inputEncoding='utf8',
    outputEncoding='hex' 
) {
    const cipher = crypto.createCipheriv(mode, Buffer.from([0x81, 0x5d, 0x98, 0xe9, 0xa4, 0x89, 0x8a, 0x9a, 0x81, 0x5d, 0x98, 0xe9, 0xa4, 0x89, 0x8a, 0x9a, 0x81, 0x5d, 0x98, 0xe9, 0xa4, 0x89, 0x8a, 0x9a, 0x81, 0x5d, 0x98, 0xe9, 0xa4, 0x89, 0x8a, 0x9a]), iv)
    cipher.setAutoPadding(padding)
    let ciphertext = cipher.update(plaintext, inputEncoding, outputEncoding)
    ciphertext += cipher.final(outputEncoding)

    return { 
        iv: iv.toString(outputEncoding), 
        ciphertext 
    }
}

function createCiphertext(plaintext) {
    return encrypt('aes-256-ecb', plaintext.concat(ECB_COOKIE));
}

app.post('/ecb', jsonParser, function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html'});
    const { plaintext } = request.body
    const { ciphertext } = createCiphertext(plaintext);
    response.end(ciphertext);
});

app.post('/dev', urlEncodedParser, function(request, response){
    response.writeHead(200, {'Content-Type': 'text/html'});
    const { plaintext } = request.body
    const { ciphertext } = createCiphertext(plaintext);
    response.end(ciphertext);
});

app.listen(80);