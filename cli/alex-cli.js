#!/usr/bin/env node

/*
 * Copyright 2018 - 2020 TU Dortmund
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
  .requiredOption('-d --do, <do>', 'What do you want to do with ALEX? [test|learn|compare].')
  .requiredOption('-u, --user <credentials>', 'Credentials with the pattern "email:password".')
  .option('-c, --config <file>', 'Add the json file that contains the configuration for the web driver.')
  .option('--targets <targets...>', 'The base URL and mirrors of the target application as comma separated list.')
  .option('--setup <name>', 'The name of the setup to execute.')
  .option('--formulas <file>', 'The json file that contains the LTL formulas.')
  .option('--models <files...>', `The files to json encoded learned models. Can only be used in combination with '--do="compare"'`)
  .option('-p, --project <file>', `Add the json file that contains a project. Cannot be used in combination with '-s', '-t' and '--targets'.`)
  .option('-s, --symbols <file>', 'Add the json file that contains all necessary symbols.')
  .option('-t, --tests <file>', 'Add the json file that contains all tests that should be executed. Omit this if you want to learn.')
  .option('-f, --files <files>', 'A file or directory that contains files to upload to ALEX.')
  .option('-o, --out <file>', 'A file where test reports and learned models are written to.')
  .option('--clean-up', 'If the project is deleted after a test or learning process.')
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