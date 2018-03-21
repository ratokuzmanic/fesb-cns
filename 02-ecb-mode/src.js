const http   = require('http');
const crypto = require('crypto');

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


http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    const plaintext = req.url.slice(1, req.url.length)
    console.log(plaintext)

    const { ciphertext } = encrypt('aes-256-ecb', plaintext.concat(ECB_COOKIE));
    
    console.log(ciphertext);
    res.end(ciphertext);
}).listen(8080);