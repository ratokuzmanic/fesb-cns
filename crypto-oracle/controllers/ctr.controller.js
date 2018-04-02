const debug = require('debug')('oracle:controllers')
const Crypto = rootrequire('crypto_modules/CryptoProvider');

module.exports = (req, res) => res.json({ciphertext: 'CTR mode'})