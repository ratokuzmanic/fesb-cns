takeFirstBlockFromCipherText = ciphertext =>    
    ciphertext.slice(0, 32);

getNextCharacter = character => 
    String.fromCharCode(character.charCodeAt(0) + 1);

module.exports = {
    takeFirstBlockFromCipherText: takeFirstBlockFromCipherText,
    getNextCharacter: getNextCharacter
}
