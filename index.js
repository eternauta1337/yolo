#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const { version } = require('../package.json');

// Define available commands.
const commandPaths = [
  './commands/checktx.js',
];
// Require all commands.
const commands = commandPaths.map(commandPath => {
  return require(commandPath);
});

// Register each command in the program.
commands.forEach(command => command.register(program));

// Program definition.
program
	.name('yolo')
  .usage('<command> [options]')
  .version(version, '-v, --version')
  .on('--help', displayHelp)
  // Display an error when an unsupported command is entered.
  .on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
  });

// Parse program.
program.parse(process.argv);

// Show custom help if no command is entered.
if(process.argv.length === 2) displayHelp();

function displayHelp() {
  program.help(() => {

    // Title.
    const str = figlet.textSync(`yolo`);
    console.log(chalk`{redBright ${str}}`);

    // Version.
    console.log(chalk`\n          {gray version ${version}}`);

    // Commands list with short description.
    console.log(chalk`\n{red.bold Commands:}`);
    commands.forEach(command => {
      if(command.signature) {
        console.log(chalk`- {blue.bold ${command.signature}} - {gray.italic ${command.description}}`);
      }
    });
    console.log(`\n`);

    process.exit(0);
  });
}

