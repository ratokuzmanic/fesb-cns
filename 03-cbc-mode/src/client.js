const http = require('http');
const { subtract, add } = require('math-buffer');
const xor = require('buffer-xor');
var pkcs7 = require('pkcs7');

const GET_REQUEST_CONFIG = {
    host: 'localhost',
    port: '3000',
    path: '/cbc/iv/challenge',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}

const POST_REQUEST_CONFIG = {
    host: 'localhost',
    port: '3000',
    path: '/cbc/iv',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

getChallenge = () => 
    new Promise((resolve, reject) => {
        const request = http.request(GET_REQUEST_CONFIG, response => {
            let data = '';
            response.on('data', chunk => data += chunk);    
            response.on('end', () => resolve(JSON.parse(data)));
        });
        request.end();        
    });

getIvAndCiphertext = plaintext => 
    new Promise((resolve, reject) => {
        const data = JSON.stringify({ plaintext });

        const request = http.request(POST_REQUEST_CONFIG, response => {
            response.setEncoding('utf8');

            response.on('data', data => resolve(JSON.parse(data)));            
            response.on('error', error => reject());
        });

        request.write(data);
        request.end();
    });

getNextIv = (iv, shift) => {
    const diff = add(shift, Buffer.from(iv, 'hex'));
    return diff.slice(0, diff.byteLength - 1);
}

async function getShift() {
    const { iv: firstIv  } = await getIvAndCiphertext('test');
    const { iv: secondIv } = await getIvAndCiphertext('test');
    return subtract(Buffer.from(secondIv, 'hex'), Buffer.from(firstIv, 'hex'));
}

(async () => {
    const { iv, ciphertext } = await getChallenge();
    const shift = await getShift(); 
    
    const challengeIv = Buffer.from(iv, 'hex');
    const { iv: currentIv } = await getIvAndCiphertext('test');
    let iterationIv = getNextIv(currentIv, shift);

    for(let i = 0; i < 4; i++) {
        let plaintext = Buffer.from('zeppelin', 'utf8');    
        let plaintextWithPadding = Buffer.from(pkcs7.pad(plaintext));

        let payload = xor(xor(iterationIv, challengeIv), plaintextWithPadding).toString('hex');
        console.log(await getIvAndCiphertext(payload));

        iterationIv = getNextIv(iterationIv, shift);
    }
})();