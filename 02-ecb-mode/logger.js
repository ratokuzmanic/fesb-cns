const chalk = require('chalk');

wrapStringWithWhitespace = (string, numberOfWhitespaces) => 
    `${' '.repeat(numberOfWhitespaces)}${string}${' '.repeat(numberOfWhitespaces)}`;
    
logHex = (title, string) => {
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

logError = (title, error) => {
    console.log(`\n${chalk.white.bgRed(wrapStringWithWhitespace(title, 8))}`);
    console.log(`Details: ${error}`);
}

logSuccess = (title, details) => {
    console.log(`\n${chalk.black.bgGreen(wrapStringWithWhitespace(title, 8))}`);
    console.log(`Details: ${details}`);
}

module.exports = {
    prettyLogHex: logHex,
    prettyLogError: logError,
    prettyLogSuccess: logSuccess
}
