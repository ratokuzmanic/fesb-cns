const http = require('http');
const { prettyLogHex, prettyLogError, prettyLogSuccess } = require('./logger');
const { request: { get: getRequest, post: postRequest }, app } = require('./config');
const { decryptChallenge } = require('./decrypt');

takeFirstBlockFromCiphertext = ciphertext =>    
    ciphertext.slice(0, app.ciphertextBlockSize);

getNextCharacter = character => 
    String.fromCharCode(character.charCodeAt(0) + 1);

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
        const initialPadding = 'a'.repeat((app.numberOfCookieCharacters - 1) - cookie.length);  
        const goalCiphertext = await getCiphertext(initialPadding);
        const goalBlock = takeFirstBlockFromCiphertext(goalCiphertext);

        let character = app.firstCharacterInSpace;
        for(let characterCount = 0; characterCount < app.characterIterationSpace; characterCount++) {
            const padding = 'a'.repeat((app.numberOfCookieCharacters - 1) - cookie.length);
            const plaintext = `${padding}${cookie}${character}`;

            const ciphertext = await getCiphertext(plaintext);
            const firstBlock = takeFirstBlockFromCiphertext(ciphertext);

            if(firstBlock === goalBlock) {
                cookie += character;
                break;
            }
            character = getNextCharacter(character);
        }
    }

    prettyLogSuccess('Cookie discovered', `The seeked cookie is "${cookie}"`);

    const challenge = await getChallenge();
    decryptChallenge(cookie, challenge)
    .then(plaintext => prettyLogSuccess('Joke decrypted', plaintext))
    .catch(error => prettyLogError('Error on joke decrypt', error));
})();
