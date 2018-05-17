const crypto = require('crypto')

import { Server, Constants } from 'config'
import serverAPI from 'app/services/server-api/ServerAPI.js'
import { msgSent } from 'app/redux/actions/clientActions.js'
import { loadKey } from './utils.js'
import CryptoProvider from '../../../services/security/CryptoProvider.js'
import { randomBytes } from 'crypto'

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
        const { ciphertext, iv, tag } = CryptoProvider.encrypt('GCM', {
            key,
            iv: randomBytes(12),
            plaintext: action.payload
        });
        Object.assign(message, { content: ciphertext, iv, tag });
    }
    else {
        Object.assign(message, { content: action.payload });
    }

    serverAPI.send(message).then(
        dispatch(msgSent(Object.assign({}, message, { content: action.payload })))
    )
}
