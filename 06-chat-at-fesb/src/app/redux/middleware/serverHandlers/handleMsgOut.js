const crypto = require('crypto')

import { Server, Constants } from 'config'
import serverAPI from 'app/services/server-api/ServerAPI.js'
import { msgSent } from 'app/redux/actions/clientActions.js'
import { loadKey } from './utils.js'
import CryptoProvider from '../../../services/security/CryptoProvider.js'
import { randomBytes } from 'crypto';

const { MsgType } = Constants

export default ({ getState, dispatch }, next, action) => {
    const { meta: { wrapped } } = action
    if (wrapped) return next(action)

    const { 
        client: { nickname, id },
        credentials
    } = getState()

    //=================================================== 
    // Try to load an encryption key for this client id
    //=================================================== 
    const key = loadKey(id, credentials)

    //=================================================== 
    // If the encryption key is successfully loaded, 
    // it is implied that all outgoing messages from this 
    // client will be encrypted with that key.  
    //===================================================
  
    const message = {
        type: MsgType.BROADCAST,
        id,
        nickname,
        timestamp: Date.now()
    }

    if(key) {
        const encryptionKey = Buffer.alloc(32);
        const hmacKey = Buffer.alloc(32);
        key.copy(encryptionKey, 0, 0, key.byteLength / 2);
        key.copy(hmacKey, 0, key.byteLength / 2, 64);

        const { ciphertext: content, iv } = CryptoProvider.encrypt('CBC', {
            key: encryptionKey,
            iv: randomBytes(16),
            plaintext: action.payload
        })
        Object.assign(message, { content, iv });
        
        const hmac = crypto.createHmac('sha256', hmacKey);
        hmac.update(JSON.stringify(message));
        const digest = hmac.digest().toString('hex');
        const authTag = digest.slice(0, digest.length / 2);
        Object.assign(message, { authTag });
    }
    else {
        Object.assign(message, { content: action.payload });
    }

    const privateDisplayMessage = {
        type: MsgType.BROADCAST,
        id,
        nickname,
        timestamp: Date.now(),
        content: action.payload
    }

    serverAPI.send(message).then(
        dispatch(msgSent(privateDisplayMessage))
    )
}