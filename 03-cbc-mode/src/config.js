const app = {
    ciphertextBlockSize: 32
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
    path: '/cbc/iv/challenge',
    method: 'GET'
};

const postRequest = {
    ...commonRequest,
    path: '/cbc/iv',
    method: 'POST'
};

module.exports = {
    app: app,
    request: {
        get: getRequest,
        post: postRequest
    }
}
