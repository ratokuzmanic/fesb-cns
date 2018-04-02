const app = {
    numberOfCookieCharacters: 16,
    ciphertextBlockSize: 32,
    characterIterationSpace: 93,
    firstCharacterInSpace: "!"
};

const destination = {
    host: 'localhost',
    port: '80',
    path: '/ecb'
};

const getRequest = {
    ...destination,
    path: '/ecb/challenge',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

const postRequest = {
    urlEncoded: {
        ...destination,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
    json: {
        ...destination,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }        
    }    
};

const pbkdf2 = {
    salt: 'salt',
    iterations: 300000,
    size: 32,
    hash: 'sha512'
}

module.exports = {
    app: app,
    request: {
        getRequest: getRequest,
        postRequest: postRequest
    },
    pbkdf2: pbkdf2    
}
