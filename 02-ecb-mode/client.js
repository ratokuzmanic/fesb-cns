const http = require('http');
const querystring = require('querystring');
const helpers = require('./helpers');
const { prettyLogHex } = require('./logger');
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
                console.log(`Error on POST promise: ${error}`);
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
    let letter = "!";
    for(let i = 0; i < 1; i++) {
        letter = helpers.getNextCharacter(letter);
        let plaintext = helpers.addLeftPadding('a', 15, letter);
        let test = await sendPostRequest(plaintext, requestConfig.urlEncoded);
        console.log(test);
    }    
})();
