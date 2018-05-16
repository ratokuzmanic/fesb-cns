import { 
    KEY_GENERATE, 
    KEY_GENERATED,
    KEY_DELETE
} from './actionTypes.js'


export const generateKey = payload => dispatch => {
    dispatch({
        type: KEY_GENERATE,
        payload: { id: payload.id }
    })

    // Simulating a call to "slow" PBKDF2
    setTimeout(() => dispatch({
        type: KEY_GENERATED,
        payload: {
            id: payload.id,
            key: payload.secret
        }
    }), 1000)

    //=================================================== 
    // Replace the above with true PBKDF2 function. 
    //
    // If KEY generated successfully dispatch 
    // the following message:
    //
    //    const msg = {
    //         type: KEY_GENERATED,
    //         payload: { 
    //             id: payload.id, 
    //             key: key // Generated key 
    //         }
    //    }
    //
    // The message can be dispatched as follows:
    //
    //     dispatch(msg)
    //
    // If the key generation process results in a failure 
    // with error "error", disptach the following message:
    //
    //    const msg = {
    //         type: KEY_GENERATE,
    //         payload: { 
    //             id: payload.id, 
    //             error: error // Resulting error
    //         }
    //         error: true
    //    }
    //
    //===================================================
}

export const deleteKey = id => ({
    type: KEY_DELETE,
    payload: { id }
})
