const etherscan = require('../utils/etherscan');
const chalk = require('chalk');
const ethers = require('ethers')

const signature = 'check <contractAddress> <calldata>';
const description = 'Decodes calldata in calls to contracts';
const help = chalk`
The command takes an address of a deployed contract and the calldata used for the call. It retrieves the contract's ABI from Etherscan, decodes de calldata against it, and prints out information about the call that can be understood in human terms.

{red Eg:}

{blue > yolo check 0x818E6FECD516Ecc3849DAf6845e3EC868087B755 0x29589f61000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000008e0bbf33b07f0a6aa6ceea07bb8f0734e57201cb800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a38af210bdf2cc479000000000000000000000000440bbd6a888a36de6e2f6a25f65bc4e16874faa9000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000045045524d00000000000000000000000000000000000000000000000000000000}
Address: 0x818E6FECD516Ecc3849DAf6845e3EC868087B755
`;

module.exports = {
  signature,
  description,
  register: (program) => {
    program
      .command(signature, {noHelp: true})
      .description(description)
      .on('--help', () => console.log(help))
      .action(async (contractAddress, calldata) => {
        // Retrieve source code (with abi) from Etherscan.
        // Note: could fetch ABI directly, but this brings in additional data.
        const result = await etherscan.getSourceCodeFull(contractAddress)
        const data = result[0]
        const contractName = data.ContractName
        const abi = JSON.parse(data.ABI)

        // Extract function selector from calldata.
        const selector = calldata.slice(2, 10)

        // Sweep ABI items of type 'function' and find a match with the selector.
        let matchingAbiItem = abi.find(abiItem => {
          if (abiItem.type === 'function') {
            const signature = `${abiItem.name}(${abiItem.inputs.map(input => input.type).join(',')})`
            const signatureHash = ethers.utils.id(signature).slice(2, 10)

            return signatureHash === selector
          }
        })

        if (!matchingAbiItem) {
          throw new Error(`Unable to find a matching function call for selector ${selector} in the retrieved ABI.`)
        }

        // Decode calldata.
        const payload = `0x${calldata.slice(10, calldata.length)}`
        const types = matchingAbiItem.inputs.map(input => input.type)
        const decoded = ethers.utils.defaultAbiCoder.decode(types, payload)

        // Print output.
        console.log('\n');
        console.log(`${contractName} at ${contractAddress}`)
        console.log(`Contract code: https://etherscan.io/address/${contractAddress}#code`)
        console.log('\n');
        console.log(`  ${matchingAbiItem.name}(`)
        let idx = 0
        matchingAbiItem.inputs.map(input => {
          console.log(`    ${input.name}: ${input.type} = ${
            decoded[idx]
          }`)
          idx++
        })
        console.log('  )')
      });
  }
};
