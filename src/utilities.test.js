const utilities = require('./utilities');

const {
  NAME_KEY,
  VERSION_KEY,
} = require('./constants');

test('sortByNameAndVersionCaseInsensitive utility sorts alphabetically, '
  + 'in a case insensitive manner for component name ("A" and "a" are considered the same)', () => {
  const unsortedArrayInput = [
    { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1.0.0' },
    { [NAME_KEY]: 'PACKAGE_B', [VERSION_KEY]: 'B1.0.0' },
    { [NAME_KEY]: 'PACKAGE_A', [VERSION_KEY]: 'A1.0.0' },
    { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'A1.0.0' },
  ];
  expect(utilities.sortByNameAndVersionCaseInsensitive(unsortedArrayInput))
    .toEqual([
      { [NAME_KEY]: 'PACKAGE_A', [VERSION_KEY]: 'A1.0.0' },
      { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'A1.0.0' },
      { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1.0.0' },
      { [NAME_KEY]: 'PACKAGE_B', [VERSION_KEY]: 'B1.0.0' },
    ]);
});

test('sortByNameAndVersionCaseInsensitive sorts alphabetically, '
  + 'in a case insensitive manner for componentVersion ("A" and "a" are considered the same)', () => {
  const unsortedArrayInput = [
    { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'b1.0.0' },
    { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1.0.0' },
    { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'A1.0.0' },
    { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'a1.0.0' },
  ];
  expect(utilities.sortByNameAndVersionCaseInsensitive(unsortedArrayInput))
    .toEqual([
      { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'A1.0.0' },
      { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'a1.0.0' },
      { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'b1.0.0' },
      { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1.0.0' },
    ]);
});

test('sortByNameAndVersionCaseInsensitive sorts alphabetically by componentName and componentVersion', () => {
  const unsortedArrayInput = [
    { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1.0.0' },
    { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'A1.0.0' },
    { [NAME_KEY]: 'PACKAGE_A', [VERSION_KEY]: 'A1.0.0' },
    { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1.0.0' },
    { [NAME_KEY]: 'package_D', [VERSION_KEY]: 'D2.0.0' },
    { [NAME_KEY]: 'package_D', [VERSION_KEY]: 'D1.0.0' },
    { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1.0.0' },
    { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'a1.0.0' },
  ];
  expect(utilities.sortByNameAndVersionCaseInsensitive(unsortedArrayInput))
    .toEqual([
      { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'A1.0.0' },
      { [NAME_KEY]: 'PACKAGE_A', [VERSION_KEY]: 'A1.0.0' },
      { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'a1.0.0' },
      { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1.0.0' },
      { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1.0.0' },
      { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1.0.0' },
      { [NAME_KEY]: 'package_D', [VERSION_KEY]: 'D1.0.0' },
      { [NAME_KEY]: 'package_D', [VERSION_KEY]: 'D2.0.0' },
    ]);
});

test('getUniquesByNameAndVersion called on list without upper case duplicates outputs the list without duplicates '
  + '(there are no objects with the same componentName and componentVersion)', () => {
  const duplicatesArrayInput = [
    { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1_threeTimes.0.0' },
    { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'A1_oneTime.0.0' },
    { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1_threeTimes.0.0' },
    { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1_twoTimes.0.0' },
    { [NAME_KEY]: 'package_D', [VERSION_KEY]: 'D2_oneTime.0.0' },
    { [NAME_KEY]: 'package_D', [VERSION_KEY]: 'D1_oneTime.0.0' },
    { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1_twoTimes.0.0' },
    { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1_threeTimes.0.0' },
  ];
  expect(utilities.getUniquesByNameAndVersion(duplicatesArrayInput))
    .toEqual([
      { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1_threeTimes.0.0' },
      { [NAME_KEY]: 'package_A', [VERSION_KEY]: 'A1_oneTime.0.0' },
      { [NAME_KEY]: 'package_B', [VERSION_KEY]: 'B1_twoTimes.0.0' },
      { [NAME_KEY]: 'package_D', [VERSION_KEY]: 'D2_oneTime.0.0' },
      { [NAME_KEY]: 'package_D', [VERSION_KEY]: 'D1_oneTime.0.0' },
    ]);
});

test('getUniquesByNameAndVersion called on list with duplicated (upper cased) component name outputs the list without duplicates', () => {
  const duplicatesArrayInput = [
    { [NAME_KEY]: 'PACKAGE_C', [VERSION_KEY]: 'C1_threeTimes.0.0' },
    { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1_threeTimes.0.0' },
    { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1_threeTimes.0.0' },
  ];
  expect(utilities.getUniquesByNameAndVersion(duplicatesArrayInput))
    .toEqual([
      { [NAME_KEY]: 'PACKAGE_C', [VERSION_KEY]: 'C1_threeTimes.0.0' },
    ]);
});

test('getUniquesByNameAndVersion called on list with duplicated (upper cased) component version outputs the list without duplicates', () => {
  const duplicatesArrayInput = [
    { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1_THREETIMES.0.0' },
    { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1_threeTimes.0.0' },
    { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1_threeTimes.0.0' },
  ];
  expect(utilities.getUniquesByNameAndVersion(duplicatesArrayInput))
    .toEqual([
      { [NAME_KEY]: 'package_C', [VERSION_KEY]: 'C1_THREETIMES.0.0' },
    ]);
});

test('isValidPackageLockJson returns false if input is incorrect', () => {
  const input = { dependencies: { 'some package': { } } };
  expect(utilities.isValidPackageLockJson(input)).toBe(false);
});
