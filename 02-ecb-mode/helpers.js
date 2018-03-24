const chalk = require('chalk');

wrapStringWithWhitespace = (string, numberOfWhitespaces) => 
    `${' '.repeat(numberOfWhitespaces)}${string}${' '.repeat(numberOfWhitespaces)}`;

takeFirstHalf = string => 
    string.slice(0, string.length / 2);

getNextCharacter = character => 
    String.fromCharCode(character.charCodeAt(0) + 1);

addLeftPadding = (character, count, rest) =>
    character.repeat(count) + rest;

prettyLogHex = (title, string) => {
    const stringWithSeparators = string
        .replace(/(.{2})/g,"$1:")
        .slice(0, -1);
    const bitCount = string.length * 4;
    const byteCount = bitCount / 8;

    console.log(`\n${chalk.inverse(wrapStringWithWhitespace(title, 8))}`);
    console.log(`String:     ${string}`);
    console.log(`Hex format: ${chalk.yellow(stringWithSeparators)}`);
    console.log(`Length of hex string is ${chalk.green(`${string.length} characters`)} equal to ${chalk.green(`${bitCount} bits`)} and ${chalk.green(`${byteCount} bytes`)}\n`);    
}

module.exports = {
    takeFirstHalf: takeFirstHalf,
    getNextCharacter: getNextCharacter,
    addLeftPadding: addLeftPadding,
    prettyLogHex: prettyLogHex
}
