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

const GetFileEncodingHeader = (filePath) => {
  const readStream = fs.openSync(filePath, 'r');
  const bufferSize = 2;
  const buffer = new Buffer(bufferSize);
  let readBytes = 0;

  if (readBytes = fs.readSync(readStream, buffer, 0, bufferSize, 0)) {
      return buffer.slice(0, readBytes).toString("hex");
  }   

  return "";
}

const ReadFileSyncUtf8 = (filePath) => {
  const fileEncoding = GetFileEncodingHeader(filePath);
  let content = null;

  if (fileEncoding === "fffe" || fileEncoding === "utf16le") {
      content = fs.readFileSync(filePath, "ucs2"); // utf-16 Little Endian
  } else if (fileEncoding === "feff" || fileEncoding === "utf16be") {
      content = fs.readFileSync(filePath, "uts2").swap16(); // utf-16 Big Endian
  } else {
      content = fs.readFileSync(filePath, "utf8");
  }

  // trim removes the header...but there may be a better way!
  return content.toString("utf8").trimStart();
}

const GetJson = (filePath) => {
  const jsonContents = ReadFileSyncUtf8(filePath);
  infoMessage(`Found file encoding header: ` + GetFileEncodingHeader(filePath));

  return JSON.parse(jsonContents);
}

const processFiles = async () => {
  let dependencies;
  infoMessage(
    chalk`Extracting information from {blue ${input}}...`,
    chalk`Program arguments:\n    input: {blue ${input}}\n    output: {blue ${output}}\n    verbose: {blue ${verbose}}`,
  );

  try {
    dependencies = GetJson(input);
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
