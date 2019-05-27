const chalk = require('chalk');

let verbose = false;

const setVerbose = (newVerboseValue) => {
  verbose = newVerboseValue;
};

const infoMessage = (message, verboseMessage) => {
  console.log(chalk`{green v} ${message}`);
  if (verbose && verboseMessage) {
    console.log(`  ${verboseMessage}`);
  }
};

const errorMessage = (message, verboseMessage) => {
  console.error(chalk`{red x} ${message}`);

  if (verbose && verboseMessage) {
    console.error(`  Detailed error: ${verboseMessage}`);
  }
};

module.exports = {
  setVerbose,
  infoMessage,
  errorMessage,
};
