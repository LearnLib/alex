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
docker run -it alex-cli:latest -h
```

### From source

```bash
git clone https://github.com/LearnLib/alex.git
cd ./alex/cli
npm ci
npm run start -- -h
```

## Usage

Execute `npm run start -- -h` to see a complete list of parameters and their descriptions.
Fine usage examples [here](./examples/google/README.md).