const crypto = require('crypto')

import { serverMsg } from 'app/redux/actions/serverActions.js'
import { JSONparse } from 'app/utils/safeJSON.js'
import { clientError } from 'app/redux/actions/clientActions.js'
import { loadKey } from './utils.js'
import CryptoProvider from '../../../services/security/CryptoProvider.js'

export default ({ getState, dispatch }, next, action) => {
    const { meta: { serialized } } = action
    if (!serialized) return next(action)

    let message = JSONparse(action.payload)

    if (Object.is(message, undefined)) {
        return dispatch(clientError(`JSON.parse error: ${data}`))
    }

    if (message.id) {
        const { credentials } = getState()

        //=================================================== 
        // Try to load an encryption key for this client id;
        // please note that this is a remote client.
        //===================================================         
        const key = loadKey(message.id, credentials)

        //=================================================== 
        // If the encryption key is successfully loaded,
        // it is implied that all incoming messages from this 
        // remote client will be encrypted with that key. 
        // So, we decrypt the messages before reading them.  
        //===================================================
        if (key) {
            const decryptionKey = Buffer.alloc(32);
            const hmacKey = Buffer.alloc(32);
            key.copy(decryptionKey, 0, 0, key.byteLength / 2);
            key.copy(hmacKey, 0, key.byteLength / 2, 64);

            message = {...message};

            const messageWithoutAuthTag = Object.keys(message)
            .filter(key => key !== 'authTag')
            .reduce((obj, key) => {
                obj[key] = message[key];
                return obj;
            }, {});
            const hmac = crypto.createHmac('sha256', hmacKey);
            hmac.update(JSON.stringify(messageWithoutAuthTag));
            const digest = hmac.digest().toString('hex');
            const authTag = digest.slice(0, digest.length / 2);

            if(authTag === message.authTag) {
                const { plaintext } = CryptoProvider.decrypt('CBC', {
                    key: decryptionKey,
                    iv: Buffer.from(message.iv, 'hex'),
                    ciphertext: message.content
                });
                message.content = plaintext;
            }
            else {
                message.content = `AUTHENTICATION FAILURE`
            }            
        }
    }

    dispatch(serverMsg(message))
}