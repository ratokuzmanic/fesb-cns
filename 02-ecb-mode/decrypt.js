const crypto = require('crypto');

const pbkdf2Config = {
    salt: 'salt',
    iterations: 300000,
    size: 32,
    hash: 'sha512'
}

decrypt = (mode, key, iv, ciphertext) => {
    const padding = true;
    const inputEncoding = 'hex';
    const outputEncoding = 'utf8';

    const decipher = crypto.createDecipheriv(mode, key, Buffer.from(iv, inputEncoding));
    decipher.setAutoPadding(padding);
    let plaintext = decipher.update(ciphertext, inputEncoding, outputEncoding);
    plaintext += decipher.final(outputEncoding);
    return plaintext;
}

getDecryptedJoke = (cookie, challenge) =>
    new Promise((resolve, reject) => {
        crypto.pbkdf2(cookie, pbkdf2Config.salt, pbkdf2Config.iterations, pbkdf2Config.size, pbkdf2Config.hash, (error, key) =>
            error
            ? reject(`Failed to generate a key with error: ${error}`)
            : resolve(decrypt('aes-256-cbc', key, challenge.iv, challenge.ciphertext))
        )
    });

module.exports = {
    getDecryptedJoke: getDecryptedJoke
}
