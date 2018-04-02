const crypto = require('crypto');

const cookie = 'rxuz2ylq3s1p4uoq';
const pbkdf2Config = {
    salt: 'salt',
    iterations: 300000,
    size: 32,
    hash: 'sha512'
};
const challenge = {
    iv: 'f173d50e49b1bcff66b5f113da6bd733',
    ciphertext: '121c2f86544b2b560ce5868ae7e70ca9d72293fc087d5e8728bae6b6312fae251ca339e35857461a9cfd2226521df981a17d0fb2451fb02abaf1361cff842e73be78ddd39ab46c9d9f6055cac0b43554'
};

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

crypto.pbkdf2(cookie, pbkdf2Config.salt, pbkdf2Config.iterations, pbkdf2Config.size, pbkdf2Config.hash, (error, key) =>
    console.log(
        error
        ? `Failed to generate a key with error: ${error}`
        : decrypt('aes-256-cbc', key, challenge.iv, challenge.ciphertext)
    )
);
