const chalk = require('chalk');
const ethers = require('ethers');

const signature = 'eth2wei [value]';
const description = 'Converts ether units to wei';
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
          ethers.utils.parseEther(value, 'ether').toString()
        );
      });
  }
};
