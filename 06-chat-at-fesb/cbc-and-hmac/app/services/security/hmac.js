const crypto = require('crypto')

const algorithm = 'sha256';

const hash = ({ key, message }) => {
    const objectToHash = typeof(message) === 'string' 
        ? message
        : JSON.stringify(message);

    const hmac = crypto.createHmac(algorithm, key);
    hmac.update(objectToHash);
    return hmac.digest().toString('hex').slice(0, 32);
}

const isValidHash = ({ hash, key, message }) => {
    const digest = hash({ key, message });

    if(digest.length !== hash.length) {
        return false;
    }

    let isValid = true;
    for(let i = 0; i < digest.length; i++) {
        if(digest[i] !== hash[i]) {
            isValid = false;
        }
    }
    return isValid;
}

export { hash, isValidHash }
