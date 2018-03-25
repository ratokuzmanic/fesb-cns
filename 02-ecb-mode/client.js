const http = require('http');
const querystring = require('querystring');
const { request: { getRequest, postRequest }, app } = require('./configs');
const { prettyLogHex, prettyLogError, prettyLogSuccess } = require('./logger');
const { getDecryptedJoke } = require('./decrypt');

const GET_REQUEST_CONFIG = getRequest;
const POST_REQUEST_CONFIG = postRequest.urlEncoded;

takeFirstBlockFromCiphertext = ciphertext =>    
    ciphertext.slice(0, app.ciphertextBlockSize);

getNextCharacter = character => 
    String.fromCharCode(character.charCodeAt(0) + 1);

getChallenge = () =>
    new Promise((resolve, reject) => {
        const request = http.request(GET_REQUEST_CONFIG, response => {
            let data = '';
            response.on('data', chunk => data += chunk);    
            response.on('end', () => resolve(JSON.parse(data)));
        }); 
        request.end();       
    });

getCiphertext = plaintext =>
    new Promise((resolve, reject) => {
        const data = POST_REQUEST_CONFIG === postRequest.urlEncoded
            ? querystring.stringify({ plaintext })
            : JSON.stringify({ plaintext });

        const request = http.request(POST_REQUEST_CONFIG, response => {
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

    for(let cookieCharacterCount = 0; cookieCharacterCount < app.numberOfCookieCharacters; cookieCharacterCount++) {
        let initialPadding = 'a'.repeat(15 - cookie.length);  
        let goalCiphertext = await getCiphertext(initialPadding);
        let goalBlock = takeFirstBlockFromCiphertext(goalCiphertext);

        let character = app.firstCharacterInSpace;
        for(let characterCount = 0; characterCount < app.characterIterationSpace; characterCount++) {
            let padding = 'a'.repeat(15 - cookie.length);
            let plaintext = `${padding}${cookie}${character}`;

            let ciphertext = await getCiphertext(plaintext);
            let firstBlock = takeFirstBlockFromCiphertext(ciphertext);

            if(firstBlock === goalBlock) {
                cookie += character;
                break;
            }
            character = getNextCharacter(character);
        }
    }

    prettyLogSuccess('Cookie discovered', `The seeked cookie is "${cookie}"`);

    getChallenge().then(challenge => 
        getDecryptedJoke(cookie, challenge)
        .then(plaintext => prettyLogSuccess('Joke decrypted', plaintext))
        .catch(error => prettyLogError('Error on joke decrypt', error))
    );
})();
