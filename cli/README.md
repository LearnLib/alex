# ALEX CLI

A command line interface for running tests and learning experiments with [ALEX](https://github.com/LearnLib/alex) **(v2.0.\*)**.

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


