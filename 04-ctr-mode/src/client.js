const http = require('http');
const crypto = require('crypto');
const xor = require('buffer-xor');
const { request: { get: getRequest, post: postRequest } } = require('./config');

getChallenge = () => 
    new Promise((resolve, reject) => {
        const request = http.request(getRequest, response => {
            let data = '';
            response.on('data', chunk => data += chunk);    
            response.on('end', () => resolve(JSON.parse(data)));
        });
        request.end();        
    });

getCiphertext = plaintext => 
    new Promise((resolve, reject) => {
        const data = JSON.stringify({ plaintext });

        const request = http.request(postRequest, response => {
            response.setEncoding('utf8');

            response.on('data', data => resolve(JSON.parse(data)));            
            response.on('error', error => reject(error));
        });

        request.write(data);
        request.end();
    });

decodePlaintext = (challengeCiphertext, ciphertext, plaintext) => 
    xor(xor(Buffer.from(challengeCiphertext, 'hex'), Buffer.from(ciphertext, 'hex')), Buffer.from(plaintext, 'hex')).toString('utf8');

isHit = possiblePlaintext => possiblePlaintext.includes('Chuck');

getZeroOuttedBufferOfSameSize = source => {
    const length = source.length / 2;
    return Buffer.alloc(length).toString('hex');
}

(async () => {
    const { ciphertext } = await getChallenge();
    const myText = getZeroOuttedBufferOfSameSize(ciphertext);

    while(true) {
        let { ciphertext: ciph } = await getCiphertext(myText);
        let possiblePlaintext = decodePlaintext(ciphertext, ciph, myText);
        if(isHit(possiblePlaintext)) {
            console.log(possiblePlaintext);
            break;
        }
    }
    
})();
