const http = require('http');
const querystring = require('querystring');
const { requestConfig } = require('./configs');
const { prettyLogHex, prettyLogError, prettyLogSuccess } = require('./logger');
const { takeFirstBlockFromCipherText, getNextCharacter } = require('./helpers');

const REQUEST_CONFIG = requestConfig.json;

sendPostRequest = plaintext =>
    new Promise((resolve, reject) => {
        const data = REQUEST_CONFIG === requestConfig.urlEncoded
            ? querystring.stringify({ 'plaintext' : plaintext })
            : JSON.stringify({ plaintext: plaintext });

        const request = http.request(REQUEST_CONFIG, response => {
            response.setEncoding('utf8');
            response.on('data', data => {
                const { ciphertext } = JSON.parse(data);
                prettyLogHex(`Response for '${plaintext}'`, ciphertext);
                resolve(ciphertext);
            });
            response.on('error', error => {
                prettyLogError('Error on POST request', error);
                reject();
            });
        });

        request.write(data);
        request.end();
    });

(async () => {
    let cookie = '';

    for(let cookieLetters = 0; cookieLetters < 16; cookieLetters++) {
        let initialPadding = 'a'.repeat(15 - cookie.length);  
        let goalCiphertext = await sendPostRequest(initialPadding);
        let goalBlock = takeFirstBlockFromCipherText(goalCiphertext);

        let character = "!";
        for(let possibleCharacters = 0; possibleCharacters < 93; possibleCharacters++) {
            let padding = 'a'.repeat(15 - cookie.length);
            let plaintext = `${padding}${cookie}${character}`;

            let ciphertext = await sendPostRequest(plaintext);
            let firstBlock = takeFirstBlockFromCipherText(ciphertext);

            if(firstBlock === goalBlock) {
                cookie += character;
                break;
            }
            character = getNextCharacter(character);
        }
    }

    prettyLogSuccess('Cookie discovered', `The seeked cookie is "${cookie}"`);
})();
