wrapStringWithWhitespace = (string, numberOfWhitespaces) => 
    `${' '.repeat(numberOfWhitespaces)}${string}${' '.repeat(numberOfWhitespaces)}`;

takeFirstHalf = string => 
    string.slice(0, string.length / 2);

getNextCharacter = character => 
    String.fromCharCode(character.charCodeAt(0) + 1);

addLeftPadding = (character, count, rest) =>
    character.repeat(count) + rest;

module.exports = {
    takeFirstHalf: takeFirstHalf,
    getNextCharacter: getNextCharacter,
    addLeftPadding: addLeftPadding
}
