import { serverMsg } from 'app/redux/actions/serverActions.js'
import { JSONparse } from 'app/utils/safeJSON.js'
import { clientError } from 'app/redux/actions/clientActions.js'
import { loadKey, splitKey } from './utils.js'
import CryptoProvider from '../../../services/security/CryptoProvider.js'
import { hash, validate } from '../../../services/security/hmac.js'

export default ({ getState, dispatch }, next, action) => {
    const { meta: { serialized } } = action
    if (!serialized) return next(action)

    let message = JSONparse(action.payload)

    if (Object.is(message, undefined)) {
        return dispatch(clientError(`JSON.parse error: ${data}`))
    }

    if (message.id) {
        const { credentials } = getState()
    
        const key = loadKey(message.id, credentials)

        if (key) {
            const { symmetricKey, hmacKey } = splitKey(key);
        
            const messageWithoutAnAuthTag = Object.assign({}, message, { authTag: undefined });

            if(validate({ hash: message.authTag, key: hmacKey, message: messageWithoutAnAuthTag })) {
                const { plaintext } = CryptoProvider.decrypt('CBC', {
                    key: symmetricKey,
                    iv: Buffer.from(message.iv, 'hex'),
                    ciphertext: message.content
                });
                message.content = plaintext;
            }
            else {
                message.content = 'AUTHENTICATION FAILURE'
            }            
        }
    }

    dispatch(serverMsg(message))
}