const { 
    NODE_ENV='dev',
    HOST='localhost',
    PORT=3000,
    KEY_SEED,
    API_KEY,
    ARP_COOKIE,
    ARP_CHALLENGE,
    ECB_COOKIE,
    ECB_CHALLENGE,
    CBC_IV_CHALLENGE,
    CBC_IV_INCREMENT=4,
    CTR_CHALLENGE
} = process.env

const dev = {
    HOST,
    PORT: parseInt(PORT, 10),
    PBKDF2: {
        hash: 'sha512',
        size: 32,
        iterations: 50000,
        salt: 'salt'
    },
    
    // A seed used to derive a unique encryption key.
    KEY_SEED,
    API_KEY,
    ARP_COOKIE,
    ARP_CHALLENGE,

    // Targeted cookie; each student gets a unique cookie to guess/break.
    ECB_COOKIE: ECB_COOKIE ? String(ECB_COOKIE) : undefined,
    ECB_CHALLENGE,
    PLAINTEXT_LIMIT: 64,
    CBC_IV_CHALLENGE,
    CBC_IV_INCREMENT: parseInt(CBC_IV_INCREMENT, 10),
    CTR_CHALLENGE,

    //-----------------------------
    // VIEW TEXT (for GET requests)
    //-----------------------------
    VIEW: {
        index: {
            title: 'Cryptography and Network Security',
            subtitle: 'Welcome to crypto labs @FESB',
            table: {
                title: 'Crypto ORACLE answers the following queries:',
                header: ['Route path', 'Method', 'Params', 'Response', 'Description'],
                rows: [{
                    title: 'arp',
                    paths: [{
                        path: '/arp',
                        method: 'POST',
                        params: `
                        { auth_key: string }`,
                        response: '{ cookie: string (utf8) }',
                        description: `Fetch the COOKIE. This request must be authenticated.`
                    }, 
                    
                    {
                        path: '/arp/challenge',
                        method: 'GET',
                        params: 'none',
                        response: '{ iv: string (hex), ciphertext: string (hex) }',
                        description: `Fetch a challenge encrypted in CBC mode using a key 
                        derived from the COOKIE. The key is derived using pbkdfv2 algorithm.`
                    }]
                }, 
                
                {
                    title: 'ecb',
                    paths: [{ 
                        path: '/ecb',
                        method: 'POST',
                        params: '{ plaintext: string (utf8) }',
                        response: '{ ciphertext: string (hex) }',
                        description: `Get an encrypted concatenation of 
                        the plaintext and COOKIE in ECB mode.`
                    }, 
                    
                    { 
                        path: '/ecb/challenge',
                        method: 'GET',
                        params: 'none',
                        response: '{ iv: string (hex), ciphertext: string (hex) }',
                        description: `Fetch a challenge encrypted in CBC mode using a key 
                        derived from the COOKIE. The key is derived using pbkdf2 algorithm.`
                    }]
                }, 
                
                {
                    title: 'cbc',
                    paths: [{
                        path: '/wordlist.txt',
                        method: 'GET',
                        params: 'none',
                        response: 'wordlist.txt',
                        description: `Fetch a file comprising a list of words from 
                        which a challenge word is selected by the "predictable 
                        initialization vector CBC oracle".`
                    },

                    { 
                        path: '/cbc/iv',
                        method: 'POST',
                        params: '{ plaintext: string (hex) }',
                        response: '{ iv: string (hex), ciphertext: string (hex) }',
                        description: `Get a chosen plaintext word encrypted in CBC mode
                        using a predictable initialization vector (IV).`
                    },

                    { 
                        path: '/cbc/iv/challenge',
                        method: 'GET',
                        params: 'none',
                        response: '{ iv: string (hex), ciphertext: string (hex) }',
                        description: `Fetch a challenge word encrypted in CBC mode using 
                        a predictable initialization vector (IV).`
                    }]
                }, 
                
                {
                    title: 'ctr',
                    paths: [{
                        path: '/ctr',
                        method: 'POST',
                        params: '{ plaintext: string (hex) }',
                        response: '{ ciphertext: string (hex) }', 
                        description: `Fetch an encrypted plaintext in the CTR mode. The 
                        crypto oracle uses a random but low-entropy initialization vector 
                        (IV); i.e., the IV is selected randomly from a small set of values.`
                    },

                    {
                        path: '/ctr/challenge',
                        method: 'GET',
                        params: 'none',
                        response: '{ ciphertext: string (hex) }',
                        description: `Fetch a challenge encrypted in the CTR mode using 
                        a random but low-entropy initialization vector (IV); i.e., the IV 
                        is selected randomly from a small set of values.`
                    }]
                }],
            }
        },
    },

    //-----------------------------
    // ERROR MESSAGES
    //-----------------------------
    ERRORS: {
        ENOTFOUND: {
            title: 'Error',
            message: 'Requested resource not found.',
            status: 404
        },

        EPLAINTEXT_LIMIT: {
            title: 'Error',
            message: 'You exceeded the plaintext size.',
            status: 400
        },
        
        ENOTAUTHORIZED: {
            title: 'Authorization Error',
            message: 'You are not authorized for the requested resource.',
            status: 403
        },

        ESERVER: {
            title: 'Error',
            message: 'Sorry, your request cannot be processed.',
            status: 500
        }        
    }    
}

const config = { dev }
module.exports = config[NODE_ENV]