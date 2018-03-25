const app = {
    numberOfCookieCharacters: 16,
    characterIterationSpace: 93,
    firstCharacterInSpace: "!",
    ciphertextBlockSize: 32
};

const destination = {
    host: 'localhost',
    port: '80'
};

const getRequest = {
    ...destination,
    path: '/',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

const postRequest = {
    urlEncoded: {
        ...destination,
        path: '/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
    json: {
        ...destination,
        path: '/ecb',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }        
    }    
};

module.exports = {
    app: app,
    request: {
        getRequest: getRequest,
        postRequest: postRequest
    }    
}