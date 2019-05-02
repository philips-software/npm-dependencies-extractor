const {
  NAME_KEY,
  VERSION_KEY,
} = require('./constants');

const componentNameAndVersionCaseInsensitiveComparator = (a, b) => {
  const nameA = a[NAME_KEY].toUpperCase();
  const nameB = b[NAME_KEY].toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  const versionA = a[VERSION_KEY].toUpperCase();
  const versionB = b[VERSION_KEY].toUpperCase();
  if (versionA < versionB) {
    return -1;
  }
  if (versionA > versionB) {
    return 1;
  }
  return 0;
};

const sortByNameAndVersionCaseInsensitive = array => array
  .sort(componentNameAndVersionCaseInsensitiveComparator);

const getUniquesByNameAndVersion = (array) => {
  const result = [];
  const map = new Map();
  array.forEach((element) => {
    const uniqueKeyInSet = element[NAME_KEY].toUpperCase()
      + element[VERSION_KEY].toUpperCase();
    if (!map.has(uniqueKeyInSet)) {
      map.set(uniqueKeyInSet, true);
      result.push({
        [NAME_KEY]: element[NAME_KEY],
        [VERSION_KEY]: element[VERSION_KEY],
      });
    }
  });
  return result;
};

module.exports = {
  sortByNameAndVersionCaseInsensitive,
  getUniquesByNameAndVersion,
};
