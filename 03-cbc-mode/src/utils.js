const MAX_32_INTEGER =  (Math.pow(2, 32) - 1)    

const incrementUInt32By = (bigint, addend=1, offset=12) => {    
    if (offset < 0) return
    
    const current = bigint.readUInt32BE(offset)
    const sum = current + addend

    if (sum <= MAX_32_INTEGER) {
        return bigint.writeUInt32BE(sum, offset)
    }

    const reminder = sum % (MAX_32_INTEGER + 1)
    const carry = Math.floor(sum/MAX_32_INTEGER)

    bigint.writeUInt32BE(reminder, offset)
    incrementUInt32By(bigint, carry, offset - 4)
}

module.exports = incrementUInt32By
