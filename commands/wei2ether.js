const chalk = require('chalk');
const ethers = require('ethers');

const signature = 'wei2ether [value]';
const description = 'Converts wei units to ether';
const help = chalk`
${description}
`;

module.exports = {
  signature,
  description,
  register: (program) => {
    program
      .command(signature, {noHelp: true})
      .description(description)
      .on('--help', () => console.log(help))
      .action((value) => {
        console.log(
          ethers.utils.formatEther(value, 'wei')
        );
      });
  }
};
