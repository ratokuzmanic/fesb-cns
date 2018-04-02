const http = require('http');
const { subtract, add } = require('math-buffer');
const xor = require('buffer-xor');

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

getNextIv = (iv, shift) => {
    const diff = add(shift, Buffer.from(iv, 'hex'));
    return diff.slice(0, diff.byteLength - 1);
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

(async () => {
    const { 
        iv: challengeIv, 
        ciphertext: challengeCiphertext 
    } = await getChallenge();

    const { iv: singleShiftedIv } = await getIvAndCiphertext('test');
    const shift = subtract(Buffer.from(singleShiftedIv, 'hex'), Buffer.from(challengeIv, 'hex'));

    /* Iteration */

    let challengeIv_buffer = Buffer.from(challengeIv, 'hex');
    let plaintext = Buffer.from('zeppelin', 'utf8');
    let iv = getNextIv(singleShiftedIv, shift);

    console.log(plaintext)

    for(let i = 0; i < 1; i++) {
        let payload = xor(xor(iv, challengeIv_buffer), plaintext);
        console.log(payload.toString('hex'));
        //console.log(await getIvAndCiphertext(payload.toString('hex')));

        iv = getNextIv(iv, shift);
    }
})();