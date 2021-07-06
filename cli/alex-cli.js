#!/usr/bin/env node

/*
 * Copyright 2018 - 2021 TU Dortmund
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { Command } = require('commander');
const chalk = require('chalk');
const cli = require('./src/cli');
const { VERSION } = require('./src/constants');

/**
 * The program.
 *
 * @type {commander.Command}
 */
const program = new Command();

program
  .version(VERSION)
  .requiredOption('--uri <uri>', `The URI where ALEX is running without trailing.`)
  .requiredOption('-d --do, <do>', 'What do you want to do with ALEX? [test|learn|compare|poll].')
  .requiredOption('-u, --user <credentials>', 'Credentials with the pattern "email:password".')
  .option('--setup <name>', 'The name of the setup to execute.')
  .option('--models <files...>', `The files to json encoded learned models. Can only be used in combination with '--do="compare"'`)
  .option('-p, --project <file>', `Add the json file that contains a project.`)
  .option('-pn, --project-name <name>', 'The name of the project, Cannot be used in combination with -p.')
  .option('-o, --out <file>', 'A file where test reports and learned models are written to.')
  .option('--clean-up', 'If the project is deleted after a test or learning process.')
  .option('--no-wait', 'Don\'t wait for learner or testing processes to finish.')
  .option('--poll-test-report <args...>', 'Poll for a specific test report. 1. srg is the id, 2. arg is a timeout in ms. Cannot be used with anything else.')
  .option('--poll-learner-result <args...>', 'Poll for a specific learner result. 1. srg is the id, 2. arg is a timeout in ms. Cannot be used with anything else.')
  .option('--callback-url <args...>', `Callback URL that is called when a learner process or test process is finished. 1. arg: Method ['GET', 'POST', 'PUT', 'DELETE'], 2. arg: URL.`)
  .parse(process.argv);

(async () => {
  try {
    await cli.run(program);
    console.log(chalk.green('CLI terminated successfully.'));
    process.exit(0);
  } catch (e) {
    console.log(chalk.red(e));
    console.log(chalk.red('CLI terminated with errors.'));
    process.exit(1);
  }
})();