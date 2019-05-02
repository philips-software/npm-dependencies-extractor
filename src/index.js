#! /usr/bin/env node

const program = require('commander');
const fs = require('fs-extra');
const chalk = require('chalk');

const dependencyExtractor = require('./dependencies-extractor');
const formatter = require('./formatter');

program
  .version('0.0.1', '-v, --version')
  .option('-o, --output [filename]', 'specifies the output filename', 'dependencies.js')
  .option('--verbose', 'Verbose output of commands and errors')
  .option(
    '-i, --input [file]',
    'specifies filename to extract the dependencies from',
    'package-lock.json',
  )
  .parse(process.argv);

const { input, output, verbose } = program;
const txtOutput = `${output}.txt`;

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

const processFiles = async () => {
  let dependencies;
  infoMessage(
    chalk`Extracting information from {blue ${input}}...`,
    chalk`Program arguments:\n    input: {blue ${input}}\n    output: {blue ${output}}\n    verbose: {blue ${verbose}}`,
  );

  try {
    dependencies = await fs.readJSON(input);
  } catch (e) {
    errorMessage(chalk`Could not open {blue ${input}} for reading...`, e);
    return;
  }

  const extractedDependenciesJsonArr = dependencyExtractor.getFlatListOfDependencies(dependencies);

  infoMessage(
    chalk`Writing {blue ${extractedDependenciesJsonArr.length}} dependencies as JSON array to {blue ${output}}`,
  );
  try {
    await fs.writeJSON(output, extractedDependenciesJsonArr, { spaces: 2, eol: '\n' });
  } catch (e) {
    errorMessage(chalk`Could not write to {blue ${output}}`, e);
  }

  const flatListOfDependenciesAsTxt = formatter
    .formatDependenciesAsLines(extractedDependenciesJsonArr);

  infoMessage(
    chalk`Writing dependencies as text lines to {blue ${txtOutput}}`,
  );
  try {
    await fs.outputFile(txtOutput, flatListOfDependenciesAsTxt);
  } catch (e) {
    errorMessage(chalk`Could not write to {blue ${txtOutput}}`, e);
  }
};

processFiles();
