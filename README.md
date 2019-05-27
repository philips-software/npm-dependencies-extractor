# npm-dependencies-extractor
This is a CLI package that provides a command *extract-dependencies* to extract the flat list of (all) dependencies from a package-lock.json file (or another file with the same structure of your choice. If you want, instead of the package-lock.json, you may specify as input file the JSON file generated by the npm command to list json dependencies, such as:
```
npm list --json > inputFile.json
``` 
or, if you only want to see the production dependencies, generate the input as:
```
npm list --json --prod > inputFile.json 
```

Why the need to create npm-dependencies-extractor?
The dependencies information as output by the package-lock.json or the npm list command is verbose, and requires some processing if you simply want to retrieve a (flat) list of your dependencies. Also, package-lock.json may contain more times a dependency that is present in different branches of the dependency tree.

__npm-dependencies-extractor__ generates, from your input, the flat list of dependencies, in two formats.
The first output format is a js file containing the array of dependencies formatted as JSON objects (with keys *name* and *version*), with no nesting, like:
```
    [
        { ‘name’: ‘dependencyName_A’, ‘version’: ‘0.0.1’},
        { ‘name’: ‘dependencyName_B’, ‘version’: ‘2.0.0’},
        { ‘name’: ‘dependencyName_B’, ‘version’: ‘2.0.1’}
    ]
```
The second output format is a txt file containing an array of dependencies, one per line, formatted as name@version, like:
```
  dependencyName_A@0.0.1
  dependencyName_B@2.0.0
  dependencyName_B@2.0.1
```

## Prerequisites
- you should have Node installed (this script was tested with node v8.12.0)

- make sure you do not have a fixed depth configured in npm, so that npm install or npm list returns all dependencies (dependencies at all levels of depth).
```
npm config get depth
```
If something else than Infinity is returned, then remove the depth limitation by:
```
npm config delete depth
```

- you should create the input json with dependencies by either:
(generates package-lock.json, with both dev and prod dependencies:)
```
npm install
```
or
(generates a file similar to the structure of package-lock.json, but you may control whether to only contain dev or prod dependencies:)
```
npm list --json --prod > inputFile.json
```

- The following encodings of the input file are supported: utf8, utf16le.
  If the input file does not have a header containing the byte order mark, then you need to provide the encoding parameter, else the encoding is assumed to be utf8.

## Installation
Install globally:
```shell
npm install -g npm-dependencies-extractor
```
Or you could use it without installing by running:
```shell
npx npm-dependencies-extractor extract-dependencies [options]
```

# Usage
```
extract-dependencies [options]
```
### Supported options:
| Flag              | Alias | Functionality
| ----------------- |:-----:| -------------------------------------
| --input [filename]|  -i   | Filename of the package-lock.json file to extract dependencies from. Default value: package-lock.json
| --encoding |  -e   | Encoding of the input file. Allowed values: utf8, utf16le.
| --output [filename]|  -o   | Js filename to which the flat list of dependencies is written. If the file already exists, it will be overwritten. Default value: dependencies.js. One more representation of the flat dependencies is generated, in the form of text (as <output>.txt)
| --verbose         |       | Verbose output of commands and errors


## Usage scenarios

### Scenario 1: You run the npm-dependencies-extractor's command without adding it as a dependency to your project
From the installation folder of npm-dependencies-extractor, run:
```shell
npm run extract-dependencies -- [options]
```
or, if you don't want to install it, run:
```
npx npm-dependencies-extractor extract-dependencies [options]
```

### Scenario 2: You include the npm-dependencies-extractor as a dependency of your project, and call its command in your project's scripts, by:
```shell
extract-dependencies [options] 
```
## FAQ
1.
>   _Question_: I get an 'Unexpected token' error when my input JSON file is read; why?
>   
>   _Answer_: This is most likely caused because your file is encoded in a format not supported yet, 
>   or because your file format is supported but its header does not contain a byte order mark (BOM) to describe its encoding.
>   In the latter case, please provide to the script the encoding known by you by means of an additional parameter, like:
`--encoding <encodingOfTheInputFile>`.
>
>   Currenlty supported values for encoding are:  utf8, utf16le

