const {
  encodings,
  getFileHeader,
  tryMatchFileHeaderToEncoding,
  getNodeJsEncodingForFile,
} = require('./file-encoding-matcher');

const filenameUtf8WithBOM = './test-data/differentEncodings/UTF8_BOM.json';
const filenameUtf8WithoutBOM = './test-data/differentEncodings/UTF8_NOBOM.json';
const filenameUtf16leWithBOM = './test-data/differentEncodings/UTF16_littleEndian_BOM.json';
const filenameUtf16leWithoutBOM = './test-data/differentEncodings/UTF16_littleEndian_NOBOM.json';
const filenameUtf16beWithBOM = './test-data/differentEncodings/UTF16_bigEndian_BOM.json';
const filenameUtf16beWithoutBOM = './test-data/differentEncodings/UTF16_bigEndian_NOBOM.json';

describe('file-encoding-matcher', () => {
  /*
    getFileHeader
  */

  it('correctly reads the file header of a file encoded as UTF8 with BOM',
    () => {
      expect(
        getFileHeader(filenameUtf8WithBOM, 3),
      ).toEqual('efbbbf'); // Same as output of: hexdump -n 3 -C test-data/differentEncodings/UTF8_BOM.json
    });

  it('correctly reads the file header of a file encoded as UTF8 without BOM',
    () => {
      expect(
        getFileHeader(filenameUtf8WithoutBOM, 3),
      ).toEqual('7b0a20'); // Same as output of: hexdump -n 3 -C test-data/differentEncodings/UTF8_NOBOM.json
    });

  it('correctly reads the file header of a file encoded as UTF16 little endian with BOM',
    () => {
      expect(
        getFileHeader(filenameUtf16leWithBOM, 2),
      ).toEqual('fffe'); // Same as output of: hexdump -n 2 -C test-data/differentEncodings/UTF16_littleEndian_BOM.json
    });

  it('correctly reads the file header of a file encoded as UTF16 little endian without BOM',
    () => {
      expect(
        getFileHeader(filenameUtf16leWithoutBOM, 2),
      ).toEqual('7b00'); // Same as output of: hexdump -n 2 -C test-data/differentEncodings/UTF16_littleEndian_NOBOM.json
    });

  it('correctly reads the file header of a file encoded as UTF16 big endian with BOM',
    () => {
      expect(
        getFileHeader(filenameUtf16beWithBOM, 2),
      ).toEqual('feff'); // Same as output of: hexdump -n 2 -C test-data/differentEncodings/UTF16_bigEndian_BOM.json
    });

  it('correctly reads the file header of a file encoded as UTF16 big endian without BOM',
    () => {
      expect(
        getFileHeader(filenameUtf16beWithoutBOM, 2),
      ).toEqual('007b'); // Same as output of: hexdump -n 2 -C test-data/differentEncodings/UTF16_bigEndian_NOBOM.json
    });

  /*
    tryMatchFileHeaderToEncoding
  */

  it('maps the file header of a file encoded as UTF8 with BOM to a known encoding utf8',
    () => {
      expect(
        tryMatchFileHeaderToEncoding(filenameUtf8WithBOM, encodings),
      ).toEqual(encodings.utf8);
    });

  it('maps the file header of a file encoded as UTF8 without BOM to null (no known encoding for header)',
    () => {
      expect(
        tryMatchFileHeaderToEncoding(filenameUtf8WithoutBOM, encodings),
      ).toEqual(null);
    });

  it('maps the file header of a file encoded as UTF16 little endian with BOM to a known encoding utf16le',
    () => {
      expect(
        tryMatchFileHeaderToEncoding(filenameUtf16leWithBOM, encodings),
      ).toEqual(encodings.utf16le);
    });

  it('maps the file header of a file encoded as UTF16 little endian without BOM to null (no known encoding for header)',
    () => {
      expect(
        tryMatchFileHeaderToEncoding(filenameUtf16leWithoutBOM, encodings),
      ).toEqual(null);
    });

  it('maps the file header of a file encoded as UTF16 big endian with BOM to null (no known encoding for header)',
    () => {
      expect(
        tryMatchFileHeaderToEncoding(filenameUtf16beWithBOM, encodings),
      ).toEqual(null);
    });

  it('maps the file header of a file encoded as UTF16 big endian without BOM to null (no known encoding for header)',
    () => {
      expect(
        tryMatchFileHeaderToEncoding(filenameUtf16beWithoutBOM, encodings),
      ).toEqual(null);
    });

  /*
    getJsEncodingForFile
  */

  it('maps the file header of a file encoded as UTF8 with BOM to NodeJS encoding string "utf8"',
    () => {
      expect(
        getNodeJsEncodingForFile(filenameUtf8WithBOM),
      ).toEqual('utf8');
    });

  it('maps the file header of a file encoded as UTF8 without BOM to NodeJS encoding string "utf8"',
    () => {
      expect(
        getNodeJsEncodingForFile(filenameUtf8WithoutBOM),
      ).toEqual('utf8');
    });

  it('maps the file header of a file encoded as UTF16 little endian with BOM to NodeJS encoding string "utf16le"',
    () => {
      expect(
        getNodeJsEncodingForFile(filenameUtf16leWithBOM),
      ).toEqual('utf16le');
    });

  it('maps the file header of a file encoded as UTF16 little endian without BOM to NodeJS encoding string "utf8"',
    () => {
      expect(
        getNodeJsEncodingForFile(filenameUtf16leWithoutBOM),
      ).toEqual('utf8');
    });

  it('maps the file header of a file encoded as UTF16 big endian with BOM to NodeJS encoding "utf8"',
    () => {
      expect(
        getNodeJsEncodingForFile(filenameUtf16beWithBOM),
      ).toEqual('utf8');
    });

  it('maps the file header of a file encoded as UTF16 big endian without BOM to NodeJS encoding string "utf8"',
    () => {
      expect(
        getNodeJsEncodingForFile(filenameUtf16beWithoutBOM),
      ).toEqual('utf8');
    });
});
