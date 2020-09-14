const BN = require('bn.js');
const chalk = require('chalk');

const signature = 'hex <hexString>';
const description = 'Converts hex to uint.';
const help = chalk`
Converts a hex number to its positive integer base 10 representation.

{red Eg:}

{blue > yolo hex2uint 0x7a120}
500000
`;

module.exports = {
  signature,
  description,
  register: (program) => {
    program
      .command(signature, {noHelp: true})
      .description(description)
      .on('--help', () => console.log(help))
      .action((hexString) => {
        hexString = hexString.startsWith('0x') ? hexString.substring(2, hexString.length) : hexString;
        const decString = (new BN(hexString, 16)).toString(10);
        console.log(decString);
      });
  }
};

