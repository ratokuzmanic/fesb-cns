const http = require('http');

postRequest = (jsonData, config) =>
    new Promise((resolve, reject) => {
        const request = http.request(config, response => {
            response.setEncoding('utf8');
            response.on('data', data => resolve(JSON.parse(data)));            
            response.on('error', error => reject());
        });
        request.write(jsonData);
        request.end();
    });

getRequest = (config) =>
    new Promise((resolve, reject) => {
        const request = http.request(config, response => {
            let data = '';
            response.on('data', chunk => data += chunk);    
            response.on('end', () => resolve(JSON.parse(data)));
        }); 
        request.end();
    });

module.exports = {
    getRequest: getRequest,
    postRequest: postRequest
}
