const crypto = require('crypto')

import { Server, Constants } from 'config'
import serverAPI from 'app/services/server-api/ServerAPI.js'
import { msgSent } from 'app/redux/actions/clientActions.js'
import { loadKey, splitKey } from './utils.js'
import CryptoProvider from '../../../services/security/CryptoProvider.js'
import { randomBytes } from 'crypto'
import { hash } from '../../../services/security/hmac.js'

const { MsgType } = Constants

export default ({ getState, dispatch }, next, action) => {
    const { meta: { wrapped } } = action
    if (wrapped) return next(action)

    const { 
        client: { nickname, id },
        credentials
    } = getState()

    const key = loadKey(id, credentials)

    const message = {
        type: MsgType.BROADCAST,
        id,
        nickname,
        timestamp: Date.now()
    }

    if(key) {
        const { symmetricKey, hmacKey } = splitKey(key);

        const { ciphertext, iv } = CryptoProvider.encrypt('CBC', {
            key: symmetricKey,
            iv: randomBytes(16),
            plaintext: action.payload
        })
        Object.assign(message, { content: ciphertext, iv });        
        
        const authTag = hash({ key: hmacKey, message });
        Object.assign(message, { authTag });
    }
    else {
        Object.assign(message, { content: action.payload });
    }

    serverAPI.send(message).then(
        dispatch(msgSent(Object.assign({}, message, { content: action.payload })))
    )
}