const app = {
    numberOfCookieCharacters: 16,
    ciphertextBlockSize: 32,
    characterIterationSpace: 93,
    firstCharacterInSpace: "!"
};

const commonRequest = {
    host: 'localhost',
    port: 3000,
    headers: {
        'Content-Type': 'application/json'
    }
};

const getRequest = {
    ...commonRequest,
    path: '/ecb/challenge',
    method: 'GET'    
};

const postRequest = {
    ...commonRequest,
    path: '/ecb',
    method: 'POST'
};

const pbkdf2 = {
    salt: 'salt',
    iterations: 300000,
    size: 32,
    hash: 'sha512'
};

module.exports = {
    app: app,
    request: {
        get: getRequest,
        post: postRequest
    },
    pbkdf2: pbkdf2    
}
