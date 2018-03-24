const common = {
    host: 'localhost',
    port: '80'
};

const getRequest = {
    ...common,
    path: '/',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

const postRequest = {
    urlEncoded: {
        ...common,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
    json: {
        ...common,
        path: '/ecb',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }        
    }    
};

module.exports = {
    getRequest: getRequest,
    postRequest: postRequest
}