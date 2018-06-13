# ALEX CLI

ALEX offers a command line interface (cli) for executing tests and starting learning experiments from the command line.
Here, we show how to use it in both cases.

## Prerequisites

First, all dependencies for the cli have to be installed.
From the root of the repository execute the following commands:

```bash
cd cli/src/main/javascript
npm install
```

Furthermore, make sure that the backend of ALEX is running.
Look at the [start page](../../README.md) of this documentation to get instructions for how to run ALEX.

## Executing integration tests

For executing tests from the cli, you need three files:

1. A JSON file with exported symbols
2. A JSON file with exported test cases
3. A JSON file that contains the configuration for the web driver

You can obtain (1) and (2) by exporting the symbols and test cases in the frontend of ALEX.
The file for (3) may look like this:

```json
// config.testing.json
{
  "name": string,
  "width": number,
  "height": number,
  "implicitlyWait": number,
  "pageLoadTimeout": number,
  "scriptTimeout": number
}
```

```json
// name is "chrome" or "firefox"
{
  ...,
  "headless": boolean,
  "xvfb": number
}
```

```json
// name is "remote"
{
  ...,
  "platform": string,
  "browser": string,
  "version": string
}
```

| Property          | Description                                                                                               |
|-------------------|-----------------------------------------------------------------------------------------------------------|
| `name`            | The browser to run the tests in. Allowed values: *chrome, edge, firefox, html_unit, remote, safari*       |
| `width`           | The width of the browser. If set to 0, the default width is used.                                         |
| `height`          | The height of the browser. If set to 0, the default width is used.                                        |
| `implicitlyWait`  | Selenium implicit timeout in \[s\] >= 0                                                                   |
| `pageLoadTimeout` | Selenium page load timeout in \[s\] > 0                                                                   |
| `scriptTimeout`   | Selenium script timeout in \[s\] > 0                                                                      |
| `headless`        | If the browser should run in headless mode. Make sure the browser supports that. It is ignored otherwise. |
| `xvfb`            | The port number for the virtual frame buffer in case headless mode is not supported.                      |
| `platform`        | The platform to run the tests on. \[ANY, WINDOWS, WIN_10, WIN8_1, WIN8, VISTA, XP, MAC, SIERRA, EL_CAPITAN, YOSEMITE, MAVERICKS, MOUNTAIN_LION, SNOW_LEOPARD, LINUX, UNIX\] |
| `browser`         | The browser to execute tests in. \[chrome, MicrosoftEdge, firefox, htmlunit, iexplore, operablink, safari\] |
| `version`         | The browser version.                                                                                      |
             

The cli itself can be found at *cli/src/main/javascript*.
Here, execute `node alex-cli.js -h` to get a list of all parameters.
An exemplary call for executing tests would be:

```bash
node alex-cli.js --uri "http://localhost:8000" \
                 --target "https://www.google.com" \
                 -a "test" \
                 -u "admin@alex.example:admin" \
                 -s "/home/alex/google.symbols.json" \
                 -t "/home/alex/google.tests.json" \
                 -c "/home/alex/config.test.json"
```

Finally, the project that has been created automatically during the testing, is deleted.

## Starting learning experiments

You can also run learning experiments with the cli.
The only difference is that the configuration file is a little more complex.
An example configuration file would look like this:

```json
// config.learning.json
{
	"algorithm": {
		"name": string
	},
	"browser": BrowserConfig,
	"comment" : string,
	"eqOracle": EqOracle,
	"maxAmountOfStepsToLearn" : number,
	"resetSymbol": string,
	"symbols": string[],
	"useMQCache": boolean
}
```

| Property                  | Description                                                                                                                       |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
|`algorithm`                | The algorithm to use. The name may be one of the following values: *DHC, DT, KEARNS_VAZIRANI, LSTAR, TTT*.                        |
|`browser`                  | See above.                                                                                                                |
|`comment`                  | A comment for the process.                                                                                                        |
|`eqOracle`                 | The equivalence oracle to use.                                                                                                    |
|`maxAmountOfStepsToLearn`  | After which step the learner should stop learning. *-1* means never.                                                              |
|`resetSymbol`              | The name of the symbol that should be used for the reset. Make sure that the name exists in the file that contains the symbols.   |
|`symbols`                  | The names of the symbols that should used for learning. Make sure that the name exists in the file that contains the symbols.     |
|`useMQCache`               | If membership queries should be cached.                                                                                           |

An exemplary call would be:

```bash
node alex-cli.js --uri "http://localhost:8000" \
                 --target "https://www.google.com" \
                 -a "learn" \
                 -u "admin@alex.example:admin" \
                 -s "/home/alex/google.symbols.json" \
                 -c "/home/alex/config.learn.json"
```

where the parameter *-t* is omitted.
Once ALEX has finished learning an application, the control is given back to the user.
