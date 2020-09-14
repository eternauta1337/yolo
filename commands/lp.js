const chalk = require('chalk');
const ethers = require('ethers')

const UniswapPair = require('../abis/UniswapPair.json');

const signature = 'lp <poolAddress> <lpAmount>';
const description = 'Calculates shares in an uniswap pool';
const help = chalk`
Given the address of a uniswap pool, and an amount of pool tokens, queries the pool to calculate the amount of tokens wrapped by these lp tokens.

{red Eg:}

{blue > lp 0xdc98556ce24f007a5ef6dc1ce96322d65832a819 13.75}
4.99 | 33.14
`;

module.exports = {
  signature,
  description,
  register: (program) => {
    program
      .command(signature, {noHelp: true})
      .description(description)
      .on('--help', () => console.log(help))
      .action(async (poolAddress, lpAmount) => {
        lpAmount = parseFloat(lpAmount);

        const provider = new ethers.providers.InfuraProvider('homestead', '1dde3e7198354724b443fffdd7770cbc');

        const contract = new ethers.Contract(poolAddress, UniswapPair, provider);

        const totalSupply = parseFloat(ethers.utils.formatEther(await contract.totalSupply()));
        console.log('Pool total supply:', totalSupply);

        const reserves = await contract.getReserves();

        const share = lpAmount / totalSupply;
        console.log('Pool share:', share);

        const res0 = parseFloat(ethers.utils.formatEther(reserves[0]));
        const res1 = parseFloat(ethers.utils.formatEther(reserves[1]));

        const a = share * res0;
        const b = share * res1;

        console.log('Token 0:', a);
        console.log('Token 1:', b);
      });
  }
};

