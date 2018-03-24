const chalk = require('chalk');

wrapStringWithWhitespace = (string, numberOfWhitespaces) => 
    `${' '.repeat(numberOfWhitespaces)}${string}${' '.repeat(numberOfWhitespaces)}`;

prettyLogHex = hexString => {
    const stringWithSeparators = hexString
        .replace(/(.{2})/g,"$1:")
        .slice(0, -1);
    const bitCount = hexString.length * 4;
    const byteCount = bitCount / 8;

    console.log(`\n${chalk.inverse(wrapStringWithWhitespace('Pretty hex log', 8))}`);
    console.log(`String:     ${hexString}`);
    console.log(`Hex format: ${chalk.yellow(stringWithSeparators)}`);
    console.log(`Length of hex string is ${chalk.green(`${hexString.length} characters`)} equal to ${chalk.green(`${bitCount} bits`)} and ${chalk.green(`${byteCount} bytes`)}\n`);    
}

module.exports = {
    prettyLogHex: prettyLogHex
}
