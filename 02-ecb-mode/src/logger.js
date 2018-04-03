const chalk = require('chalk');

String.prototype.addWhitespacePadding = function(numberOfWhitespaces = 8) {
    return `${' '.repeat(numberOfWhitespaces)}${this}${' '.repeat(numberOfWhitespaces)}`;
}

String.prototype.hexFormat = function () {
    return this.replace(/(.{2})/g,"$1:").slice(0, -1);
}

String.prototype.bitCount = function() {
    return this.length * 4;
}

String.prototype.byteCount = function() {
    return this.length / 2;
}

logHex = (title, string) => {
    console.log(`\n${chalk.inverse(title.addWhitespacePadding())}`);
    console.log(`String:     ${string}`);
    console.log(`Hex format: ${chalk.yellow(string.hexFormat())}`);
    console.log(`Length of hex string is ${chalk.green(`${string.length} characters`)} equal to ${chalk.green(`${string.bitCount()} bits`)} and ${chalk.green(`${string.byteCount()} bytes`)}\n`);    
}

logError = (title, error) => {
    console.log(`\n${chalk.white.bgRed(title.addWhitespacePadding())}`);
    console.log(`Details: ${error}\n`);
}

logSuccess = (title, details) => {
    console.log(`\n${chalk.black.bgGreen(title.addWhitespacePadding())}`);
    console.log(`Details: ${details}\n`);
}

module.exports = {
    prettyLogHex: logHex,
    prettyLogError: logError,
    prettyLogSuccess: logSuccess
}
