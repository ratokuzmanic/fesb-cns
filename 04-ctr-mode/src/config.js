const app = {
    shouldAlwaysHalt: false,
    maxIterationCount: 5000
}

const commonRequest = {
    host: 'localhost',
    port: 3000,
    headers: {
        'Content-Type': 'application/json'
    }
};

const getRequest = {
    ...commonRequest,
    path: '/ctr/challenge',
    method: 'GET'
};

const postRequest = {
    ...commonRequest,
    path: '/ctr',
    method: 'POST'
};

module.exports = {
    app: app,
    request: {
        get: getRequest,
        post: postRequest
    }
}
