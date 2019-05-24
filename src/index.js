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
  .option('-e, --encoding [value]', '(optional) specifies the encoding of the input file. One of: utf8, utf16le')
  .parse(process.argv);

const {
  input, encoding, output, verbose,
} = program;

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

const nodeJsEncodingValue = {
  hex: 'hex',
  utf8: 'utf8',
  utf16le: 'utf16le', // alias: ucs2
  /*
  Note: utf16be is not supported by NodeJs currently (1).
  "If your source is big-endian, you need to first swap the bytes using Buffer.prototype.swap16()
  since Node.js currently doesn't have a 'utf16be' encoding." (2)
  (1) https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings
  (2) https://stackoverflow.com/questions/10940273/how-can-i-read-a-file-encoded-in-utf-16-in-nodejs
  */
};
const defaultNodejsEncoding = nodeJsEncodingValue.utf8;

/*
  - Not all files start with a BOM (Byte Order Mark); e.g.,
    it is optional for utf8 (see test-data encodings folder)
  - HEX representations for various BOM  header encodings:
    http://www.unicode.org/faq/utf_bom.html#BOM
    https://en.wikipedia.org/wiki/Byte_order_mark
    https://www.garykessler.net/library/file_sigs.html
  - Encoding values as needed for reading from fs.ReadJSON/fs.readFile:
    https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings
*/
const encodings = {
  // Descending order by the number of bytes needed to represent the BOM
  utf8: {
    bomNrOfBytes: 3, bomValue: 'EFBBBF', nodeJsEncodingValue: nodeJsEncodingValue.utf8,
  },
  utf16le: {
    bomNrOfBytes: 2, bomValue: 'FFFE', nodeJsEncodingValue: nodeJsEncodingValue.utf16le,
  },
  /*
  To be added when utf16be will be supported by NodeJs's readfile
  utf16be: {
    bomNrOfBytes: 2, bomValue: 'FEFF', nodeJsEncodingValue: null,
  },
  */
};

const GetFileHeader = (filePath, numberOfBytesToRead) => {
  const readStream = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(numberOfBytesToRead);
  const readBytes = fs.readSync(readStream, buffer, 0, numberOfBytesToRead, 0);
  if (readBytes) {
    return buffer.slice(0, readBytes).toString(nodeJsEncodingValue.hex);
  }

  return '';
};

const TryMatchFileHeaderToEncoding = (filePath, knownEncodings) => {
  for (let i = 0; i < Object.keys(knownEncodings).length; i += 1) {
    const encodingElem = Object.values(knownEncodings)[i];
    const numberOfBytes = encodingElem.bomNrOfBytes;
    const fileHeader = GetFileHeader(filePath, numberOfBytes);

    if (fileHeader.toUpperCase() === encodingElem.bomValue.toUpperCase()) {
      return encodingElem;
    }
  }

  return null;
};

const getNodeJsEncodingForFile = (filePath) => {
  const encodingFound = TryMatchFileHeaderToEncoding(filePath, encodings);
  if (!encodingFound) {
    infoMessage(
      chalk`  Could not determine a known encoding (byte order mark) for file ${filePath}; will use default ${defaultNodejsEncoding}.`,
    );
    return defaultNodejsEncoding;
  }
  if (!encodingFound.nodeJsEncodingValue) {
    infoMessage(
      chalk`  Could not determine the NodeJs encoding corresponding to the byte order mark ${encodingFound.bomValue} for file ${filePath}; will use default encoding ${defaultNodejsEncoding}`,
    );
    return defaultNodejsEncoding;
  }
  infoMessage(
    chalk`  Mapping file's byte order mark ${encodingFound.bomValue} to encoding ${encodingFound.nodeJsEncodingValue} for file ${filePath}`,
  );
  return encodingFound.nodeJsEncodingValue;
};

const processFiles = async () => {
  let dependencies;
  infoMessage(
    chalk`Extracting information from {blue ${input}}...`,
    chalk`Program arguments:\n    input: {blue ${input}}\n    encoding: {blue ${encoding}}\n    output: {blue ${output}}\n    verbose: {blue ${verbose}}`,
  );

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
