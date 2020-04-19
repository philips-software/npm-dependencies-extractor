#! /usr/bin/env node

const program = require('commander');
const fs = require('fs-extra');
const chalk = require('chalk');
const {
  setVerbose,
  infoMessage,
  errorMessage,
} = require('./message-handler');
const { getNodeJsEncodingForFile } = require('./file-encoding-matcher');
const dependencyExtractor = require('./dependencies-extractor');
const formatter = require('./formatter');
const utilities = require('./utilities');

program
  .version('0.0.1', '-v, --version')
  .option('-o, --output [filename]', 'specifies the output filename', 'dependencies.js')
  .option('--verbose', 'Verbose output of commands and errors')
  .option(
    '-i, --input [file]',
    'specifies filename to extract the dependencies from',
    'package-lock.json',
  )
  .option('-e, --encoding [value]', '(optional) specifies the encoding of the input file. One of: utf8, utf16le')
  .option('-io, --optionals', '(optional) include optional dependencies ')
  .option('-d, --devdependencies', '(optional) ignore dev dependencies ')
  .parse(process.argv);

const {
  input, encoding, output, verbose, optionals, devdependencies
} = program;

const txtOutput = `${output}.txt`;

const processFiles = async () => {
  setVerbose(verbose);

  let dependencies;
  infoMessage(
    chalk`Extracting information from {blue ${input}}...`,
    chalk`Program arguments:\n    input: {blue ${input}}\n    encoding: {blue ${encoding}}\n    output: {blue ${output}}\n    verbose: {blue ${verbose}}`,
  );

  let configuration;

  if (!optionals) {
    infoMessage(
      chalk`  No optionals parameter was set; We're ignoring them...`,
    );
    configuration = {
      ...configuration,
      includeOptionals: false
    }
  } else {
    configuration = {
      ...configuration,
      includeOptionals: true
    }
  }

  if (!devdependencies) {
    infoMessage(
      chalk`  No devdependencies parameter was set; We're adding them to the list...`,
    );
    configuration = {
      ...configuration,
      ignoreDevDependencies: false
    }
  } else {
    configuration = {
      ...configuration,
      ignoreDevDependencies: true
    }
  }

  try {
    let actualEncoding = encoding;
    if (!encoding) {
      infoMessage(
        chalk`  No encoding parameter provided for the input file; trying to determine it from the header of the file (if byte order mark is present)...`,
      );
      actualEncoding = getNodeJsEncodingForFile(input);
    }
    dependencies = await fs.readJSON(input, actualEncoding);
  } catch (e) {
    errorMessage(chalk`Could not open {blue ${input}} for reading...`, e);
    return;
  }

  if (!dependencies.dependencies) {
    infoMessage(chalk`No dependencies found in {blue ${input}}, exiting.`);
    return;
  }

  if (!utilities.isValidPackageLockJson(dependencies)) {
    infoMessage(chalk`Input {blue ${input}} not a valid {blue package-lock.json} format, exiting.`);
    return;
  }

  const extractedDependenciesJsonArr = dependencyExtractor.getFlatListOfDependencies(dependencies, configuration);

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
