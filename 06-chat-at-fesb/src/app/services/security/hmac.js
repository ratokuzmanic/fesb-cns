const crypto = require('crypto')

function hash({ key, message }) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(JSON.stringify(message));
    const digest = hmac.digest().toString('hex');
    return digest.slice(0, digest.length / 2);
}

function validate({ hash, key, message }) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(JSON.stringify(message));
    const digest = hmac.digest().toString('hex');
    const messageHash = digest.slice(0, digest.length / 2);

    if(messageHash.length !== hash.length) {
        return false;
    }

    let isValid = true;
    for(let i = 0; i < messageHash.length; i++) {
        if(messageHash[i] !== hash[i]) {
            isValid = false;
        }
    }
    return isValid;
}

export { hash, validate }