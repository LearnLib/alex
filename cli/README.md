# ALEX CLI

A command line interface for running tests and learning experiments with [ALEX](https://github.com/LearnLib/alex) **(v2.1.\*)**.

NPM package: [https://www.npmjs.com/package/alex-cli](https://www.npmjs.com/package/alex-cli)

## Requirements

* A running instance of ALEX
* Node.js & NPM

## Installation

### Via NPM

```bash
npm install -g alex-cli
alex-cli -h 
```

### Via Docker

```
docker pull ghcr.io/learnlib/alex/alex-cli:latest
docker run alex-cli:latest -it alex-cli -h
```

### From source

```bash
git clone https://github.com/LearnLib/alex.git
cd ./alex/cli
npm ci
node alex-cli.js -h 
```

## Usage

1. Export the symbols from ALEX ([see here](http://learnlib.github.io/alex/book/2.1.0/contents/user-manual/symbol-modeling/#export--import)).
2. Export the tests from ALEX ([see here](http://learnlib.github.io/alex/book/2.1.0/contents/user-manual/testing.html)).

Execute `node alex-cli.js -h` to see a complete list of parameters and their descriptions.
Fine usage examples [here](./examples/google/README.md).