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

const fs = require('fs');
const chalk = require('chalk');
const dateformat = require('dateformat');
const processors = require('./processors');
const utils = require('./utils');
const api = require('./api');

const Actions = {
  TEST: 'test',
  LEARN: 'learn',
  COMPARE: 'compare',
  POLL: 'poll'
};

/**
 * The interval in ms to poll for the test status.
 *
 * @type {number}
 */
const POLL_TIME_TESTING = 3000;

/**
 * The interval in ms to poll for the learner status.
 *
 * @type {number}
 */
const POLL_TIME_LEARNING = 5000;

/**
 * The commanderjs program instance.
 *
 * @type {any|null}
 * @private
 */
let program = null;

/**
 * The commanderjs options.
 *
 * @type {any|null}
 * @private
 */
let options = null;

/**
 * The user credentials that are used to log in.
 *
 * @type {{email: string, password: string}|null}
 * @private
 */
let _user = null;

/**
 * The project that is created during the process.
 * At the end, the project will be deleted.
 *
 * @type {{name: string: urls: Object[], id: number}|null}
 * @private
 */
let _project = null;

/**
 * What to do.
 * Either 'learn' or 'test'.
 *
 * @type {string|null}
 * @private
 */
let _action = null;

/**
 * The learned models to compare.
 *
 * @type {Array}
 * @private
 */
let _models = [];

async function createProject() {
  if (options.projectName) {
    // hole project
    const res1 = await api.projects.getAll();
    await utils.assertStatus(res1, 200);
    const projects = await res1.json();
    const projectWithName = projects.filter(p => p.name === options.projectName)[0];
    if (projectWithName == null) {
      throw `Could not find project by name '${options.projectName}'`;
    } else {
      _project = projectWithName;
      console.log(chalk.white.dim(`Project ${_project.name} has been fetched.`));
    }
  } else {
    // generate unique project name
    _project.project.name = 'alex-cli-'
      + `${dateformat(new Date(), 'isoDateTime')}-`
      + utils.randomString(10);

    // create project
    const res1 = await api.projects.import(_project);
    await utils.assertStatus(res1, 201);

    _project = await res1.json();

    console.log(chalk.white.dim(`Project ${_project.name} has been imported.`));
  }
}

/**
 * Write the learned model or test report into a file.
 *
 * @param {string} data The data to write into the file.
 */
function writeOutputFile(data) {
  const file = options.out;
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }

  try {
    fs.writeFileSync(file, data);
    console.log(chalk.white.dim(`Wrote result to file ${file}`));
  } catch (e) {
    console.log(chalk.bgRed(`Failed to write contents to file ${file}`));
    throw e;
  }
}

/**
 * Execute all tests.
 *
 * @return {Promise<*>}
 */
async function startTesting() {
  console.log(chalk.white.dim(`Executing tests...`));

  let result = await startTestingFromSetup();
  let report = result.report;

  if (!options.wait) {
    console.log(chalk.white.dim('Do not wait for tests to finish.'));
    console.log(chalk.white.dim(`reportId: ${report.id}`));
    return;
  }

  await pollForTestReport(report.id, -1);
}

async function startTestingFromSetup() {
  const setupName = options.setup;

  const res1 = await api.testSetups.getAll(_project.id);
  await utils.assertStatus(res1, 200);

  const setups = await res1.json();
  const setupsWithRequiredName = setups.filter(s => s.name === setupName);

  if (setupsWithRequiredName.length === 0) {
    throw `There is no test setup with the name "${setupName}" in the project.`;
  }

  const res2 = await api.testSetups.execute(_project.id, setupsWithRequiredName[0].id);
  await utils.assertStatus(res2, 200);

  return await res2.json();
}

async function waitForLearnerToFinish(startTime, timeout, testNo) {
  while(true) {
    const timeElapsed = Date.now() - startTime;
    if (timeout > -1 && timeElapsed > timeout) {
      throw `Timeout for learner process.`;
    }

    process.stdout.cursorTo(0);
    process.stdout.write(chalk.white.dim(`Wait for the learning process to finish... (${Math.floor(timeElapsed / 1000)}s elapsed)`));

    const res2 = await api.learnerResults.get(_project.id, testNo);
    await utils.assertStatus(res2, 200);
    let result = await res2.json();

    if (result.status === 'FINISHED' || result.status === 'ABORTED') {
      process.stdout.write('\n');
      return result;
    } else {
      await utils.timeout(POLL_TIME_LEARNING);
    }
  }
}

function createCallbackWebhook(events) {
  return {
    url: options.callbackUrl[1],
    method: options.callbackUrl[0],
    name: `wh-${dateformat(new Date(), 'isoDateTime')}-${utils.randomString(10)}`,
    events
  }
}

async function startLearningFromSetup() {
  const setupName = options.setup;

  const res1 = await api.learnerSetups.getAll(_project.id);
  await utils.assertStatus(res1, 200);

  const setups = await res1.json();
  const setupsWithRequiredName = setups.filter(s => s.name === setupName);

  if (setupsWithRequiredName.length === 0) {
    throw `There is no learner setup with the name "${setupName}" in the project.`;
  }

  let learnerOptions = {};
  if (options.callbackUrl) {
    learnerOptions = {
      webhook: createCallbackWebhook(['LEARNER_FINISHED'])
    };
  }

  const res2 = await api.learnerSetups.execute(_project.id, setupsWithRequiredName[0].id, learnerOptions);
  await utils.assertStatus(res2, 200);

  return await res2.json();
}

/**
 * Start learning.
 *
 * @return {Promise<*>}
 */
async function startLearning() {
  console.log(chalk.white.dim(`Start learning...`));

  // start the learning process
  let result = await startLearningFromSetup();

  if (!options.wait) {
    console.log(chalk.white.dim('Do not wait for learner process to finish.'));
    console.log(chalk.white.dim(`resultId: ${result.testNo}`));
    return;
  }

  await pollForLearnerResult(result.testNo, -1);
}

async function startComparing() {
  console.log(chalk.white.dim(`Comparing models...`));

  const res = api.learner.calculateSeparatingWord(_models);
  await utils.assertStatus(res, 200);
  const separatingWord = await res.json();

  if (separatingWord.input.length === 0) {
    throw 'Could not find a difference between both models.';
  } else {
    console.log(chalk.white.dim(`found a difference for word ${separatingWord.input}.`));
    writeOutputFile(JSON.stringify(separatingWord));
  }
}

function assertCheckResults(checkResults) {
  let passed = true;
  let numFailed = 0;
  for (let cr of checkResults) {
    passed &= cr.passed;

    if (cr.passed) {
      console.log(chalk.green(`(✓) ${cr.formula.formula}`));
    } else {
      numFailed++;
      console.log(chalk.red(`(x) ${cr.formula.formula} with prefix: ${cr.prefix} and loop: ${cr.loop}.`));
    }
  }

  if (passed) {
    console.log(chalk.white.dim('All LTL properties hold.'));
  } else {
    throw `${numFailed} LTL properties do${numFailed === 1 ? 'es' : ''} not hold.`;
  }
}

async function pollForTestReport(reportId, timeout) {
  // poll for result
  let report = null;
  const startTime = Date.now();
  while (true) {
    const timeElapsed = Date.now() - startTime;
    if (timeout > -1 && timeElapsed > timeout) {
      throw `Timeout for test process.`;
    }

    process.stdout.cursorTo(0);
    process.stdout.write(chalk.white.dim(`Waiting for tests to finish... (${Math.floor(timeElapsed / 1000)}s elapsed)`));

    const res2 = await api.testReports.get(_project.id, reportId);
    await utils.assertStatus(res2, 200);
    report = await res2.json();

    if (report.status === 'IN_PROGRESS' || report.status === 'PENDING') {
      await utils.timeout(POLL_TIME_TESTING);
    } else {
      process.stdout.write('\n');
      break;
    }
  }

  function printReport(report) {
    report.testResults.forEach(tr => {
      if (tr.passed) {
        console.log(`${chalk.bgGreen("success")} ${tr.test.name}`);
      } else {
        console.log(`${chalk.bgRed("failed")} ${tr.test.name}`);
      }
    });
  }

  // print report to terminal
  printReport(report);

  const res3 = await api.testReports.get(_project.id, report.id, 'junit');
  await utils.assertStatus(res3, 200);

  // write junit test report in a file
  if (options.out) {
    writeOutputFile(res3.body);
  }

  if (report.passed) {
    console.log(chalk.green(`${report.numTestsPassed}/${report.numTests} tests passed.`));
  } else {
    throw `${report.numTestsFailed}/${report.numTests} tests failed.`;
  }
}

async function pollForLearnerResult(testNo, timeout) {
  // poll for learner result
  const startTime = Date.now();
  const result = await waitForLearnerToFinish(startTime, timeout, testNo);
  console.log(chalk.white.dim(`The learning process finished.`));

  if (result.error) {
    throw 'The learning process finished with errors.';
  }

  // write learned model to a file
  if (options.out) {
    const model = result.steps[result.steps.length - 1].hypothesis;
    writeOutputFile(JSON.stringify(model));
  }

  // analyze model checking results
  const lastStep = result.steps[result.steps.length - 1];
  if (lastStep.modelCheckingResults.length > 0) {
    assertCheckResults(lastStep.modelCheckingResults);
  }
}

function processProgram() {

  // process required options
  _action = processors.action(options.do);
  _uri = processors.uri(options.uri);
  _user = processors.user(options.user);

  // initialize api with given uri
  api.init(_uri);

  if (options.callbackUrl) {
    processors.callbackUrl(options.callbackUrl);
  }

  if (options.do !== Actions.COMPARE) {
    if (!options.project && !options.projectName) {
      throw `You haven't specified a project.`;
    } else if (options.project && options.projectName) {
      throw `You have to specify a project by a json file or by a name.`;
    }

    if (options.project) {
      _project = processors.project(options.project);
    }
  }

  if (options.do === Actions.POLL) {
    if (options.pollTestReport) {
      processors.pollOptions(options.pollTestReport)
    } else if (options.pollLearnerResult) {
      processors.pollOptions(options.pollLearnerResult)
    } else {
      throw `You haven't specified what to poll for.`;
    }
  }

  if (_action === Actions.TEST) {
    if (!options.setup) {
      throw `You haven't specified a test setup.`;
    }
  } else if (_action === Actions.LEARN) {
    if (!options.setup) {
      throw `You haven't specified a learner setup.`;
    }
  } else if (_action === Actions.COMPARE) {
    if (!options.models) {
      throw `You haven't specified any models to compare`;
    }

    _models = processors.files(options.models);
  }
}

module.exports = {
  run: async function(cjsProgram) {
    program = cjsProgram;
    options = program.opts();

    processProgram();

    await api.auth(_user.email, _user.password);

    await createProject();

    if (options.pollTestReport) {
      const timeout = options.pollTestReport[1] == null ? 300000 : parseInt(options.pollTestReport[1]);
      await pollForTestReport(parseInt(options.pollTestReport[0]), timeout);
      return;
    }

    if (options.pollLearnerResult) {
      const timeout = options.pollLearnerResult[1] == null ? 300000 : parseInt(options.pollLearnerResult[1]);
      await pollForLearnerResult(parseInt(options.pollLearnerResult[0]), timeout);
      return;
    }

    switch (_action) {
      case Actions.TEST:
        await startTesting();
        break;
      case Actions.LEARN:
        await startLearning();
        break;
      case Actions.COMPARE:
        await startComparing();
        break;
      default:
        throw `Unknown action: ${_action}`;
    }

    if (options.cleanUp) {
      const res = await api.projects.delete(_project.id);
      await utils.assertStatus(res, 204)
      console.log(chalk.white.dim(`The project has been deleted.`));
    }
  }
}