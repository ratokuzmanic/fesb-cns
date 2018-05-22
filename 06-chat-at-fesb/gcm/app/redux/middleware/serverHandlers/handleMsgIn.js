import { serverMsg } from 'app/redux/actions/serverActions.js'
import { JSONparse } from 'app/utils/safeJSON.js'
import { clientError } from 'app/redux/actions/clientActions.js'
import { loadKey } from './utils.js'
import CryptoProvider from '../../../services/security/CryptoProvider.js'
import { isReplayAttack } from '../../../services/security/replay.js'

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
            if(isReplayAttack(message.timestamp)) {
                message.content = 'REPLAY ATTACK'
            }
            else {
                try {
                    const msgContent = message.iv + message.content + message.tag;
                    const plaintext = CryptoProvider.decrypt('GCM', {
                        key,
                        msgContent
                    });
                    message.content = plaintext;
                }
                catch (e) {
                    message.content = 'AUTHENTICATION FAILURE'
                }
            }           
        }
    }

    dispatch(serverMsg(message))
}
