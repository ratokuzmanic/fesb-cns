const crypto = require('crypto');
const { pbkdf2 } = require('./configs');

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

decryptChallenge = (cookie, challenge) =>
    new Promise((resolve, reject) => {
        crypto.pbkdf2(cookie, pbkdf2.salt, pbkdf2.iterations, pbkdf2.size, pbkdf2.hash, (error, key) =>
            error
            ? reject(`Failed to generate a key with error: ${error}`)
            : resolve(decrypt('aes-256-cbc', key, challenge.iv, challenge.ciphertext))
        )
    });

module.exports = {
    decryptChallenge: decryptChallenge
}
