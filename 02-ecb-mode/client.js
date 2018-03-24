const http = require('http');
const querystring = require('querystring');
const helpers = require('./helpers');
const { requestConfig } = require('./configs');

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function takeFirstHalfOfString(string) {
    return string.slice(0, string.length / 2);
}

function sendPostRequest(plaintext, config) {
    const data = 
        config === requestConfig.urlEncoded
        ? querystring.stringify({ 'plaintext' : plaintext })
        : JSON.stringify({ plaintext: plaintext });

    const request = http.request(config, response => {
        response.setEncoding('utf8');
        response.on('data', chunk => {
            const { ciphertext } = JSON.parse(chunk);
            helpers.prettyLogHex(ciphertext);
        });
    });

    request.write(data);
    request.end();
}

function constructLeftPaddingForCookie(numberOfAsOnLeft, lastLetter) {
    return Array(numberOfAsOnLeft).join("a") + lastLetter;
}

sendPostRequest('test', requestConfig.urlEncoded);
