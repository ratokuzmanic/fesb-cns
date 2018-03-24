const http = require('http');
const querystring = require('querystring');
const helpers = require('./helpers');
const { prettyLogHex, prettyLogError } = require('./logger');
const { requestConfig } = require('./configs');

sendPostRequest = (plaintext, config) =>
    new Promise((resolve, reject) => {
        const data = 
        config === requestConfig.urlEncoded
        ? querystring.stringify({ 'plaintext' : plaintext })
        : JSON.stringify({ plaintext: plaintext });

        const request = http.request(config, response => {
            response.setEncoding('utf8');
            response.on('data', data => {
                const { ciphertext } = JSON.parse(data);
                prettyLogHex(`Response for '${plaintext}'`, ciphertext);
                resolve(ciphertext);
            });
            response.on('error', error => {
                prettyLogError('Error on POST promise', error);
                reject();
            });
        });

        request.write(data);
        request.end();
    });

(async () => {
    let cookie = '';

    for(let j = 0; j < 16; j++) {
        let initialPadding = 'a'.repeat(15 - cookie.length);  
        let goalCiphertext = await sendPostRequest(initialPadding, requestConfig.urlEncoded);
        let goal = helpers.takeFirstCipherblock(goalCiphertext);

        let letter = "!";
        for(let i = 0; i < 93; i++) {
            let padding = 'a'.repeat(15 - cookie.length);
            let plaintext = `${padding}${cookie}${letter}`;
            let ciphertext = await sendPostRequest(plaintext, requestConfig.urlEncoded);
            let firstBlock = helpers.takeFirstCipherblock(ciphertext);
            if(firstBlock === goal) {
                cookie += letter;
                break;
            }
            letter = helpers.getNextCharacter(letter);
        }
    }
})();
