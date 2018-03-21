const http = require('http');
const querystring = require('querystring');

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function takeFirstHalfOfString(string) {
    return string.slice(0, string.length / 2);
}

const requestOptions = {
    urlEncoded: {
        host: 'localhost',
        port: '80',
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
    json: {
        host: 'localhost',
        port: '80',
        path: '/ecb',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }    
};

function sendPostRequest(plaintext, options) {
    const data = 
        options === requestOptions.urlEncoded
        ? querystring.stringify({ 'plaintext' : plaintext })
        : JSON.stringify({ plaintext: plaintext });

    const request = http.request(options, response => {
        response.setEncoding('utf8');
        response.on('data', chunk => {
            const { ciphertext } = JSON.parse(chunk);
            console.log(ciphertext);
        });
    });

    request.write(data);
    request.end();
}

function constructLeftPaddingForCookie(numberOfAsOnLeft, lastLetter) {
    return Array(numberOfAsOnLeft).join("a") + lastLetter;
}

sendPostRequest('test', requestOptions.urlEncoded);
