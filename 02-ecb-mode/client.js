const http = require('http');
const querystring = require('querystring');
const helpers = require('./helpers');
const { requestConfig } = require('./configs');

function sendPostRequest(plaintext, config) {
    const data = 
        config === requestConfig.urlEncoded
        ? querystring.stringify({ 'plaintext' : plaintext })
        : JSON.stringify({ plaintext: plaintext });

    const request = http.request(config, response => {
        response.setEncoding('utf8');
        response.on('data', chunk => {
            const { ciphertext } = JSON.parse(chunk);
            helpers.prettyLogHex(`Response for '${plaintext}'`, ciphertext);
        });
    });

    request.write(data);
    request.end();
}

sendPostRequest('test', requestConfig.urlEncoded);
