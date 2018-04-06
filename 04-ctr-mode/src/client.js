const http = require('http');
const xor = require('buffer-xor');
const { prettyLogSuccess, prettyLogError } = require('./logger');
const { app, request: { get: getRequest, post: postRequest } } = require('./config');

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

getZeroHexOfSameSizeAs = source => '0'.repeat(source.length);

isHit = possiblePlaintext => possiblePlaintext.includes('Chuck');

async function shouldAlwaysHaltAction(challengeCiphertext, payload) {
    let plaintext = null;

    for(let iteration = 0; iteration < app.maxIterationCount; iteration++) {
        let { ciphertext } = await getCiphertext(payload);
        let possiblePlaintext = xor(Buffer.from(challengeCiphertext, 'hex'), Buffer.from(ciphertext, 'hex')).toString('utf8');
        if(isHit(possiblePlaintext)) {
            plaintext = possiblePlaintext;            
            break;
        }
    }

    plaintext
    ? prettyLogSuccess('Joke found', plaintext)
    : prettyLogError('Joke not found', 'Maximum iteration count was reached. Try increasing the threashold in config.js');
}

async function shouldntAlwaysHaltAction(challengeCiphertext, payload) {
    while(true) {
        let { ciphertext } = await getCiphertext(payload);
        let possiblePlaintext = xor(Buffer.from(challengeCiphertext, 'hex'), Buffer.from(ciphertext, 'hex')).toString('utf8');
        if(isHit(possiblePlaintext)) {
            prettyLogSuccess('Joke found', possiblePlaintext);           
            break;
        }
    }
}

(async () => {
    const { ciphertext } = await getChallenge();
    const payload = getZeroHexOfSameSizeAs(ciphertext);
    
    app.shouldAlwaysHalt 
    ? shouldAlwaysHaltAction(ciphertext, payload) 
    : shouldntAlwaysHaltAction(ciphertext, payload);
})();
