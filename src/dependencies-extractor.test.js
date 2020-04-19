const packageLockFileUniqueVersions = '../test-data/npm-dependencies-unique-versions/test-package-lock.json';
const packageLockFileNoDev5Levels = '../test-data/npm-dependencies-no-dev-5-levels/test-package-lock.json';

const dependenciesExtractor = require('./dependencies-extractor');

const {
  NAME_KEY,
  VERSION_KEY,
} = require('./constants');

// eslint-disable-next-line import/no-dynamic-require
const plJsonUniqueVersions = require(packageLockFileUniqueVersions);
// eslint-disable-next-line import/no-dynamic-require
const plJsonOnlyProdDependencies5Levels = require(packageLockFileNoDev5Levels);

const packageLock2MandatoryDependencies = require('../test-data/input-with-optionals/package-lock-with-2-mandatory-dependencies.json');
const packageLock3DeclaredOptionalDependenciesAllActuallyOptional = require('../test-data/input-with-optionals/package-lock-with-total-3-dependencies-3-optionals-not-required-by-any-mandatory-dependency.json');
const packageLock4Dependencies3DeclaredOptionalActually2Optional = require('../test-data/input-with-optionals/package-lock-with-total-4-dependencies-3-optionals-of-which-1-also-occurs-as-mandatory.json');


/*
The package-lock.json loaded in the next test case reflects the
package dependencies depicted below.
Each dependency has a unique version, to enable testing that the script
matches the correct version for each package.
How to read th picture:
  -C1 represents package_C with version C1.0.0,
  -C2 represents package_C with version C2.0.0

|---A1-|
|      |---D1
|      |---E1
|      |---F1
|      |---G1
|      |---H1
|      |---I1
|
|---B1-|
       |---C1
       |---D2-|
       |      |---C1
       |      |---E2
       |
       |---F2-|
              |---G2-|
              |      |---C1
              |
              |---C2-|
                     |---H2-|
                            |---I2
*/
// eslint-disable-next-line prefer-template
test('Tests that getFlatListOfDependencies '
  + '\n - extracts all dependencies from package-lock.json at '
  + packageLockFileUniqueVersions
  + '\n - correctly matches the versions to packages (no mixing) '
  + '\n - provides dependencies in a sorted list which contains unique name + version pairs. ', () => {
  expect(dependenciesExtractor
    .getFlatListOfDependencies(plJsonUniqueVersions, false))
    .toEqual([
      { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'A1.0.0' },
      { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1.0.0' },
      { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1.0.0' },
      { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C2.0.0' },
      { [NAME_KEY]: 'package_D', [VERSION_KEY]: 'D1.0.0' },
      { [NAME_KEY]: 'package_D', [VERSION_KEY]: 'D2.0.0' },
      { [NAME_KEY]: 'package_E', [VERSION_KEY]: 'E1.0.0' },
      { [NAME_KEY]: 'package_E', [VERSION_KEY]: 'E2.0.0' },
      { [NAME_KEY]: 'package_F', [VERSION_KEY]: 'F1.0.0' },
      { [NAME_KEY]: 'package_F', [VERSION_KEY]: 'F2.0.0' },
      { [NAME_KEY]: 'package_G', [VERSION_KEY]: 'G1.0.0' },
      { [NAME_KEY]: 'package_G', [VERSION_KEY]: 'G2.0.0' },
      { [NAME_KEY]: 'package_H', [VERSION_KEY]: 'H1.0.0' },
      { [NAME_KEY]: 'package_H', [VERSION_KEY]: 'H2.0.0' },
      { [NAME_KEY]: 'package_I', [VERSION_KEY]: 'I1.0.0' },
      { [NAME_KEY]: 'package_I', [VERSION_KEY]: 'I2.0.0' },
    ]);
});

/*
The package-lock.json loaded below reflects the package dependencies as
illustrated below.
All dependecies are for production.
How to read the picture:
  -A1 represents package_A with version 1.0.0,
  -C1 represents package_C with version 1.0.0,
  -C2 represents package_C with version 2.0.0

|---A1-|
|      |---D1
|      |---E1
|      |---F1
|      |---G1
|      |---H1
|      |---I1
|
|---B1-|
       |---C1
       |---D2-|
       |      |---C1
       |      |---E2
       |
       |---F2-|
              |---G2-|
              |      |---C1
              |
              |---C2-|
                     |---H2-|
                            |---I2
*/
// eslint-disable-next-line prefer-template
test('Tests that getFlatListOfDependencies '
  + '\n - extracts all dependencies from all 5 levels of package-lock.json at '
  + packageLockFileNoDev5Levels
  + '\n - only reports once the dependencies that show up more times in the dependency tree '
  + '\n - provides dependencies in a sorted list which contains unique name + version pairs.', () => {
  expect(dependenciesExtractor
    .getFlatListOfDependencies(plJsonOnlyProdDependencies5Levels, false))
    .toEqual([
      { [NAME_KEY]: 'package_A', [VERSION_KEY]: '1.0.0' },
      { [NAME_KEY]: 'package_B', [VERSION_KEY]: '1.0.0' },
      { [NAME_KEY]: 'package_C', [VERSION_KEY]: '1.0.0' },
      { [NAME_KEY]: 'package_C', [VERSION_KEY]: '2.0.0' },
      { [NAME_KEY]: 'package_D', [VERSION_KEY]: '1.0.0' },
      { [NAME_KEY]: 'package_D', [VERSION_KEY]: '2.0.0' },
      { [NAME_KEY]: 'package_E', [VERSION_KEY]: '1.0.0' },
      { [NAME_KEY]: 'package_E', [VERSION_KEY]: '2.0.0' },
      { [NAME_KEY]: 'package_F', [VERSION_KEY]: '1.0.0' },
      { [NAME_KEY]: 'package_F', [VERSION_KEY]: '2.0.0' },
      { [NAME_KEY]: 'package_G', [VERSION_KEY]: '1.0.0' },
      { [NAME_KEY]: 'package_G', [VERSION_KEY]: '2.0.0' },
      { [NAME_KEY]: 'package_H', [VERSION_KEY]: '1.0.0' },
      { [NAME_KEY]: 'package_H', [VERSION_KEY]: '2.0.0' },
      { [NAME_KEY]: 'package_I', [VERSION_KEY]: '1.0.0' },
      { [NAME_KEY]: 'package_I', [VERSION_KEY]: '2.0.0' },
    ]);
});

describe('isDependencyOptional', () => {
  it('returns true for a dependency json with key "optional" set to true',
    () => {
      const jsonDependencyDetails = {
        version: '2.14.0',
        resolved: 'https://registry.npmjs.org/nan/-/nan-2.14.0.tgz',
        integrity: 'some-key',
        optional: true,
      };
      expect(dependenciesExtractor.isDependencyOptional({ jsonDependencyDetails }))
        .toBe(true);
    });

  it('returns false for a dependency json with key "optional" set to false',
    () => {
      const jsonDependencyDetails = {
        version: '2.14.0',
        resolved: 'https://registry.npmjs.org/nan/-/nan-2.14.0.tgz',
        integrity: 'some-key',
        optional: false,
      };
      expect(dependenciesExtractor.isDependencyOptional({ jsonDependencyDetails }))
        .toBe(false);
    });

  it('returns false for a dependency json with no key "optional"',
    () => {
      const jsonDependencyDetails = {
        version: '2.14.0',
        resolved: 'https://registry.npmjs.org/nan/-/nan-2.14.0.tgz',
        integrity: 'some-key',
      };
      expect(dependenciesExtractor.isDependencyOptional({ jsonDependencyDetails }))
        .toBe(false);
    });
});


describe('getFlatListOfDependencies deals with optional dependencies as follows:', () => {
  it(`extracts all mandatory dependencies from input ${packageLock2MandatoryDependencies}`,
    () => {
      expect(dependenciesExtractor
        .getFlatListOfDependencies(packageLock2MandatoryDependencies, false))
        .toEqual([
          { [NAME_KEY]: '@babel/code-frame', [VERSION_KEY]: '7.5.5' },
          { [NAME_KEY]: '@babel/highlight', [VERSION_KEY]: '7.5.0' },
        ]);
    });

  // eslint-disable-next-line prefer-template
  it('extracts zero dependencies from input (when input\'s dependencies are all optional) '
    + packageLock3DeclaredOptionalDependenciesAllActuallyOptional,
  () => {
    expect(dependenciesExtractor
      .getFlatListOfDependencies(packageLock3DeclaredOptionalDependenciesAllActuallyOptional, false))
      .toEqual([]);
  });

  // eslint-disable-next-line prefer-template
  it('extracts all mandatory dependencies from input json '
    + packageLock4Dependencies3DeclaredOptionalActually2Optional,
  () => {
    expect(dependenciesExtractor
      .getFlatListOfDependencies(packageLock4Dependencies3DeclaredOptionalActually2Optional, false))
      .toEqual([
        { [NAME_KEY]: 'ansi-regex', [VERSION_KEY]: '2.1.1' },
        { [NAME_KEY]: 'has-ansi', [VERSION_KEY]: '2.0.0' },
      ]);
  });
});
