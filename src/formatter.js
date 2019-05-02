const {
  NAME_KEY,
  VERSION_KEY,
} = require('./constants');

const formatDependencyAsOneLineText = dependency => `${dependency[NAME_KEY]}@${dependency[VERSION_KEY]}`;

const formatDependencyAsJsonObject = (dependencyName, dependencyVersion) => (
  {
    [NAME_KEY]: dependencyName,
    [VERSION_KEY]: dependencyVersion,
  }
);

const formatDependenciesAsLines = dependencies => dependencies
  .map(dependency => formatDependencyAsOneLineText(dependency))
  .join('\r\n');

module.exports = {
  formatDependencyAsOneLineText,
  formatDependencyAsJsonObject,
  formatDependenciesAsLines,
};
