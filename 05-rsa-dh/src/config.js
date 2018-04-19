const commonRequest = {
    host: 'localhost',
    port: 3000,
    headers: {
        'Content-Type': 'application/json'
    }
};

const getServerRSAPublicKey = {
    ...commonRequest,
    path: '/asymm/rsa/server',
    method: 'GET'    
};

const postClientRSAPublicKey = {
    ...commonRequest,
    path: '/asymm/rsa/client',
    method: 'POST'
};

const postClientDHPublicKey = {
    ...commonRequest,
    path: '/asymm/dh/client',
    method: 'POST'
};

const getChallenge = {
    ...commonRequest,
    path: '/asymm/challenge',
    method: 'GET'
}

const pbkdf2 = {
    salt: 'ServerClient',
    iterations: 1,
    size: 32,
    hash: 'sha512'
};

module.exports = {
    getServerRSAPublicKey: getServerRSAPublicKey,
    postClientRSAPublicKey: postClientRSAPublicKey,
    postClientDHPublicKey: postClientDHPublicKey,
    getChallenge: getChallenge,
    pbkdf2: pbkdf2
}
