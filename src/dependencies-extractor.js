const utilities = require('./utilities');
const {
  formatDependencyAsJsonObject,
} = require('./formatter');

const isDependencyOptional = ({ jsonDependencyDetails }) => Object.keys(jsonDependencyDetails).includes('optional')
    && (jsonDependencyDetails.optional === true);

// Gets the dependencies from the 'dependencies' attribute
const getRecursivelyDependenciesReducer = (accumulator, currentPackageKeyPairTwoSizedArray) => {
  // Push the current package info (name and version only)
  accumulator.push(
    formatDependencyAsJsonObject(
      currentPackageKeyPairTwoSizedArray[0],
      currentPackageKeyPairTwoSizedArray[1].version,
    ),
  );

  if (Object.keys(currentPackageKeyPairTwoSizedArray[1]).includes('dependencies')) {
  //  go recursively and concatenate the found dependencies
    accumulator = accumulator.concat( // eslint-disable-line no-param-reassign
      Object.entries(currentPackageKeyPairTwoSizedArray[1].dependencies)
        .reduce(getRecursivelyDependenciesReducer, []),
    );
  }
  return accumulator;
};

// Unsorted list. If input is package-lock.json, may contain duplicates
const getRawFlatListOfDependencies = inputJsonDependencies => Object
  .entries(inputJsonDependencies.dependencies)
  .reduce(getRecursivelyDependenciesReducer, []);

const getFlatListOfDependencies = inputJsonDependencies => utilities
  .sortByNameAndVersionCaseInsensitive(utilities
    .getUniquesByNameAndVersion(getRawFlatListOfDependencies(inputJsonDependencies)));

module.exports = {
  getFlatListOfDependencies,
  isDependencyOptional,
};
