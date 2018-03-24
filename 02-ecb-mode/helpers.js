takeFirstCipherblock = ciphertext =>    
    ciphertext.slice(0, 32);

getNextCharacter = character => 
    String.fromCharCode(character.charCodeAt(0) + 1);

addLeftPadding = (character, count, rest) =>
    character.repeat(count) + rest;

module.exports = {
    takeFirstCipherblock: takeFirstCipherblock,
    getNextCharacter: getNextCharacter,
    addLeftPadding: addLeftPadding
}
