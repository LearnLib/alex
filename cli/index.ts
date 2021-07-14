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

import { Command } from 'commander';
import chalk from 'chalk';
import * as context from './src/context';
import {
  processCallbackUrl,
  processCompareModelFiles,
  processEmail, processId,
  processProjectFile, processTimeout,
  processUrl,
} from './src/processors';
import { VERSION } from './src/env';
import { checkProjectIsDefined } from './src/checks';
import {
  runCompareCommand,
  runLearnCommand,
  runPollLearnerResultCommand,
  runPollTestReportCommand,
  runTestCommand
} from './src/commands';

const program: Command = new Command()
  .version(VERSION)
  .requiredOption('--url <url>', 'The URL of the REST API of an ALEX instance.', processUrl)
  .requiredOption('--email <email>', 'The email of the user to authenticate with.', processEmail)
  .requiredOption('--password <password>', 'The password of the user to authenticate with.')
  .addCommand(
    new Command('test')
      .requiredOption('--setup-name <name>', 'The name of the test setup to execute.')
      .option('-pf, --project-file <file>', 'The path to the file with a serialized project.', processProjectFile)
      .option('-pn, --project-name <name>', 'The name of the project.')
      .option('-o, --out <file>', 'The file where to save the test result as junit XML report.')
      .option('--callback-url <args...>', 'The URL that is called when the test process is finished.')
      .option('--delete-project', 'If the project should be deleted after the test run. Is ignored if -pn is used.', false)
      .option('--no-wait', 'Do not wait for the test process to finish.', false)
      .action(async (options) => {
        await context.init(program.opts());
        const mergedOptions = { ...program.opts(), ...options };
        checkProjectIsDefined(mergedOptions);
        if (options.callbackUrl) {
          mergedOptions.callbackUrl = processCallbackUrl(options.callbackUrl);
        }
        await runTestCommand(mergedOptions);
      }),
  )
  .addCommand(
    new Command('learn')
      .requiredOption('--setup-name <name>', 'The name of the learner setup to execute.')
      .option('-pf, --project-file <file>', 'The path to the file with a serialized project.', processProjectFile)
      .option('-pn, --project-name <name>', 'The name of the project.')
      .option('-o, --out <file>', 'The file where to save the learner result as dot file.')
      .option('-lo, --ltl-out <file>', 'The file where to save the modelchecker result.')
      .option('--callback-url <args...>', 'The URL that is called when the learner process is finished.')
      .option('--delete-project', 'If the project should be deleted after the learner process. Is ignored if -pn is used.', false)
      .option('--no-wait', 'Do not wait for the learner process to finish.', false)
      .action(async (options) => {
        await context.init(program.opts());
        const mergedOptions = { ...program.opts(), ...options };
        checkProjectIsDefined(mergedOptions);
        if (options.callbackUrl) {
          mergedOptions.callbackUrl = processCallbackUrl(options.callbackUrl);
        }
        await runLearnCommand(mergedOptions);
      }),
  )
  .addCommand(
    new Command('compare')
      .requiredOption('--models <files...>', 'The JSON serialized models to compare.')
      .option('-o, --out <file>', 'The file where to save the difference.')
      .action(async (options) => {
        await context.init(program.opts());
        const mergedOptions = { ...program.opts(), ...options };
        mergedOptions.models = processCompareModelFiles(options.models);
        await runCompareCommand(mergedOptions);
      }),
  )
  .addCommand(
    new Command('poll')
      .addCommand(
        new Command('test-report')
          .requiredOption('-pn, --project-name <name>')
          .requiredOption('--report-id <id>', 'The ID of the test report to wait for to finish.', processId)
          .option('--timeout <ms>', 'The maximum amount of time to wait in ms.', processTimeout, -1)
          .option('-o, --out <file>', 'The file where to save the report.')
          .action(async (options) => {
            await context.init(program.opts());
            const mergedOptions = { ...program.opts(), ...options };
            await runPollTestReportCommand(mergedOptions);
          }),
      )
      .addCommand(
        new Command('learner-result')
          .requiredOption('-pn, --project-name <name>')
          .requiredOption('--result-id <id>', 'The ID of the learner result to wait for to finish.', processId)
          .option('--timeout <ms>', 'The maximum amount of time to wait in ms.', processTimeout, -1)
          .option('-o, --out <file>', 'The file where to save the result.')
          .option('-lo, --ltl-out <file>', 'The file where to save the modelchecker result.')
          .action(async (options) => {
            await context.init(program.opts());
            const mergedOptions = { ...program.opts(), ...options };
            await runPollLearnerResultCommand(mergedOptions);
          }),
      ),
  );

(async () => {
  try {
    await program.parseAsync(process.argv);
    console.log(chalk.green('The CLI terminated successfully.'));
    process.exit(0);
  } catch (e) {
    console.log(chalk.red(e));
    console.log(chalk.red('The CLI terminated with errors.'));
    process.exit(1);
  }
})();
