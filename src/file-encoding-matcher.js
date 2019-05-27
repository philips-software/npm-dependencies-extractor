const fs = require('fs-extra');
const chalk = require('chalk');
const { infoMessage, errorMessage } = require('./message-handler');

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

const getFileHeader = (filePath, numberOfBytesToRead) => {
  const readStream = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(numberOfBytesToRead);
  const readBytes = fs.readSync(readStream, buffer, 0, numberOfBytesToRead, 0);
  if (readBytes) {
    return buffer.slice(0, readBytes).toString(nodeJsEncodingValue.hex);
  }

  return '';
};

const tryMatchFileHeaderToEncoding = (filePath, knownEncodings) => {
  for (let i = 0; i < Object.keys(knownEncodings).length; i += 1) {
    const encodingElem = Object.values(knownEncodings)[i];
    const numberOfBytes = encodingElem.bomNrOfBytes;
    const fileHeader = getFileHeader(filePath, numberOfBytes);

    if (fileHeader.toUpperCase() === encodingElem.bomValue.toUpperCase()) {
      return encodingElem;
    }
  }

  return null;
};

const getNodeJsEncodingForFile = (filePath) => {
  const encodingFound = tryMatchFileHeaderToEncoding(filePath, encodings);
  if (!encodingFound) {
    errorMessage(
      chalk`  Could not determine a known encoding (byte order mark) for file ${filePath}; will use default ${defaultNodejsEncoding}.`,
    );
    return defaultNodejsEncoding;
  }
  if (!encodingFound.nodeJsEncodingValue) {
    errorMessage(
      chalk`  Could not determine the NodeJs encoding corresponding to the byte order mark ${encodingFound.bomValue} for file ${filePath}; will use default encoding ${defaultNodejsEncoding}`,
    );
    return defaultNodejsEncoding;
  }
  infoMessage(
    chalk`  Mapping file's byte order mark ${encodingFound.bomValue} to encoding ${encodingFound.nodeJsEncodingValue} for file ${filePath}`,
  );
  return encodingFound.nodeJsEncodingValue;
};

module.exports = {
  encodings,
  getFileHeader,
  tryMatchFileHeaderToEncoding,
  getNodeJsEncodingForFile,
};
