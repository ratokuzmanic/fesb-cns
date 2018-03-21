const crypto = require('crypto');
const express = require('express');
var bodyParser = require('body-parser');

let app = express();

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({ extended: false })

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

app.post('/', jsonParser, function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    const { plaintext } = req.body
    console.log(plaintext);
    res.end(plaintext);
});

app.post('/dev', urlencodedParser, function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    const { plaintext } = req.body
    console.log(plaintext);
    res.end(plaintext);
});

const port = 80;
app.listen(port);