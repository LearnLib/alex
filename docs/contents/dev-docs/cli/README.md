# ALEX CLI

There is a *Command Line Interface* (CLI) available for starting tests and learning processes in ALEX via the command line.


## Installation

### NPM package

The CLI is available as a NodeJS module *alex-cli* and can be installed with 

`npm install -g alex-cli`

### Docker image

1. The CLI is available as a Docker image and can be installed with 
    
    `docker pull ghcr.io/learnlib/alex/alex-cli:2.1.0`

2. Run the docker image and execute CLI commands:

    `docker run alex/alex-cli alex-cli [...]`
  
  
## Usage

- Execute `alex-cli --help` to get all available parameters.
- The readme can be found [here][cli-readme].


## Examples

- For usage examples, look at the [examples directory][cli-examples] in the repository.


[cli-readme]: https://github.com/LearnLib/alex/tree/master/cli
[cli-examples]: https://github.com/LearnLib/alex/tree/master/cli/examples