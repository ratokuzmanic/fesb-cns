import { 
    KEY_GENERATE, 
    KEY_GENERATED,
    KEY_DELETE
} from './actionTypes.js'
import pbkdf2 from '../../services/security/pbkdf2.js'


export const generateKey = payload => dispatch => {
    dispatch({
        type: KEY_GENERATE,
        payload: { id: payload.id }
    })

    pbkdf2({ secret: payload.secret, salt: payload.id, size: 64 })
        .then(key => dispatch({
            type: KEY_GENERATED,
            payload: {
                id: payload.id,
                key: key
            }
        }))
        .catch(error => dispatch({
            type: KEY_GENERATED,
            payload: {
                id: payload.id,
                error: error
            },
            error: true
        }))
}

export const deleteKey = id => ({
    type: KEY_DELETE,
    payload: { id }
})
