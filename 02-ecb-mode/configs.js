const commonRequest = {
    host: 'localhost',
    port: '80',
    method: 'POST'
}

const request = {
    urlEncoded: {
        path: '/',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        ...commonRequest
    },
    json: {
        path: '/ecb',
        headers: {
            'Content-Type': 'application/json'
        },
        ...commonRequest
    }    
};

module.exports = {
    requestConfig: request
}