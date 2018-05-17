function loadKey(id, state) {
    if (!(id in state)) return undefined
    const { symmetric: { key } } = state[id]
    return key
}

function splitKey(key) {
    const symmetricKey = Buffer.alloc(32);
    const hmacKey = Buffer.alloc(32);
    key.copy(symmetricKey, 0, 0, key.byteLength / 2);
    key.copy(hmacKey, 0, key.byteLength / 2, 64);

    return { symmetricKey, hmacKey };
}

// function loadCredentials(id, state) {
//     if (!(id in state)) return {
//         key: undefined,
//         msgCount: undefined
//     }
//     const { symmetric: { key }, msgCount } = state[id]
//     return {
//         key,
//         msgCount
//     }
// }

export { loadKey, splitKey }