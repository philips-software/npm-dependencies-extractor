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
    .getFlatListOfDependencies(plJsonUniqueVersions))
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
    .getFlatListOfDependencies(plJsonOnlyProdDependencies5Levels))
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
