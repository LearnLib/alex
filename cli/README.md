# ALEX CLI

A command line interface for running tests and learning experiments with [ALEX](https://github.com/LearnLib/alex) **(v1.7.*)**.

NPM package: [https://www.npmjs.com/package/alex-cli](https://www.npmjs.com/package/alex-cli)

## Requirements

* A running instance of ALEX
* Node.js & NPM

## Installation

### Via NPM

```bash
npm install alex-cli
node node_modules/alex-cli/alex-cli.js -h 
```

### From source

```bash
git clone https://github.com/LearnLib/alex-cli.git
cd alex-cli
npm install
node alex-cli.js -h 
```

## Usage

1. Export the symbols from ALEX ([see here](http://learnlib.github.io/alex/book/1.7.0/contents/user-manual/symbol-modeling/#export--import)).
2. Export the tests from ALEX ([see here](http://learnlib.github.io/alex/book/1.7.0/contents/user-manual/testing.html)).

Execute `node alex-cli.js -h` to see a complete list of parameters and their descriptions.
For examples, see the section below.

### Configuration

#### Testing

```json
{
  "driverConfig": {
    "width": 1980,
    "height": 1080,
    "implicitlyWait": 0,
    "pageLoadTimeout": 10,
    "scriptTimeout": 10,
    "name": "chrome",
    "headless": true
  }
}
```

|argument|description|
|--------|-----------|
|width|The width of the browser|
|height|The height of the browser|
|implicitlyWait|Selenium implicit timeout value|
|pageLoadTimeout|Selenium page load timeout value|
|scriptTimeout|Selenium script timeout value|
|name|The name of the browser, 'firefox', 'chrome', 'htmlUnit', 'ie', 'safari', 'edge'|
|headless|If the browser is run headless. Only for Firefox and Chrome|

### CLI

#### Testing

```bash
node alex-cli.js --uri "http://localhost:8080" \
                 --targets "https://www.google.com,https://www.google.com" \
                 -a "test" \
                 -u "admin@alex.example:admin" \
                 -s "./symbols.json" \
                 -t "./tests.json" \
                 -c "./config.testing.json" \
                 --clean-up
```

#### Learning

```bash
node alex-cli.js --uri "http://alex.some-server.de" \
                 --target "https://www.google.com,https://www.google.com" \
                 -a "learn" \
                 -u "admin@alex.example:admin" \
                 -s "./symbols.json" \
                 -c "./config.learning.json" \
                 --clean-up
```
