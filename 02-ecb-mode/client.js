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

//sendPostRequest(test, requestConfig.urlEncoded);

//let letter = "!";
//for(let i = 0; i < 93; i++) {
//    letter = helpers.getNextCharacter(letter)
//    console.log(letter);
//}

(async () => {
    let cookie = '';

    let letter='';
    let paddingForCookie = 'a'.repeat(15 - cookie.length);
    let plaintext = `${paddingForCookie}${cookie}${letter}`;
    let ciphertext = await sendPostRequest(plaintext, requestConfig.urlEncoded);
    let goal = helpers.takeFirstCipherblock(ciphertext);

    letter = "!";
    for(let i = 0; i < 93; i++) {
        let padding = 'a'.repeat(15 - cookie.length);
        let plaintext = `${padding}${cookie}${letter}`;
        let ciphertext = await sendPostRequest(plaintext, requestConfig.urlEncoded);
        if(helpers.takeFirstCipherblock(ciphertext) == goal) {
            cookie += letter;
            break;
        }
        letter = helpers.getNextCharacter(letter);
    }   
})();
