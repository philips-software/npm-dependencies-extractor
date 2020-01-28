# CHANGELOG

## 0.0.6
- Excluding from the input file those dependencies that are declared as optional, and no other mandatory dependency requires them.
We did this because we noticed that dependencies that are declared as optional and are not required by any mandatory dependency, are simply not installed in the node_modules folder.

## 0.0.5
- including graceful degradation when no dependencies

