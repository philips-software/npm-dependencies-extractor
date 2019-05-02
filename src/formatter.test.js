const {
  formatDependencyAsOneLineText,
  formatDependenciesAsLines,
  formatDependencyAsJsonObject,
} = require('./formatter');

const {
  NAME_KEY,
  VERSION_KEY,
} = require('./constants');

test('Tests that formatDependencyAsJsonObject formats dependency as JSON object with the name/version keys and values',
  () => {
    expect(
      formatDependencyAsJsonObject(
        'package_A',
        '1.0.0',
      ),
    ).toEqual({
      [NAME_KEY]: 'package_A',
      [VERSION_KEY]: '1.0.0',
    });
  });


test('Tests that formatDependencyAsOneLineText formats an input JSON dependency as a line of text with value: name@version',
  () => {
    expect(
      formatDependencyAsOneLineText({
        [NAME_KEY]: 'package_A',
        [VERSION_KEY]: '1.0.0',
      }),
    ).toEqual('package_A@1.0.0');
  });

test('Tests that formatDependenciesAsLines formats an input JSON dependency as a line of text with value: name@version',
  () => {
    expect(
      formatDependenciesAsLines([
        {
          [NAME_KEY]: 'package_A',
          [VERSION_KEY]: '1.0.0',
        },
        {
          [NAME_KEY]: 'package_B',
          [VERSION_KEY]: '2.0.0',
        },
      ]),
    ).toEqual('package_A@1.0.0\r\npackage_B@2.0.0');
  });
