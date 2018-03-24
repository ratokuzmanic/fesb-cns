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
    let paddingForCookie = helpers.addLeftPadding('a', 15, 'r');
    let goal = await sendPostRequest(paddingForCookie, requestConfig.urlEncoded);
    console.log(helpers.takeFirstCipherblock(goal));
    console.log(goal);
   
})();
