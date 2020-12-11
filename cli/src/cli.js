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

const fs = require('fs');
const chalk = require('chalk');
const dateformat = require('dateformat');
const processors = require('./processors');
const utils = require('./utils');
const api = require('./api');
const { VERSION } = require('./constants');

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
 * The URI of the server where the backend of ALEX is running.
 *
 * @type {string|null}
 * @private
 */
let _uri = null;

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
 * The list of symbols that are required for the tests.
 *
 * @type {Object[]|null}
 * @private
 */
let _symbols = null;

/**
 * The list of symbols groups.
 *
 * @type {Object[]|null}
 * @private
 */
let _symbolGroups = null;

/**
 * The test cases that should be executed.
 *
 * @type {{id:number, name:string, parent:number|null, project:number, symbols:object[]}[]|null}
 * @private
 */
let _tests = null;

/**
 * The configuration for the web driver.
 *
 * @type {object|null}
 * @private
 */
let _config = null;

/**
 * What to do.
 * Either 'learn' or 'test'.
 *
 * @type {string|null}
 * @private
 */
let _action = null;

/**
 * The files to upload.
 *
 * @type {Array}
 * @private
 */
let _files = [];

/**
 * The LTL formulas to verify on the learned model.
 *
 * @type {*[]}
 * @private
 */
let _formulas = [];

async function _createProject(data) {

  // generate unique project name
  data.project.name = 'alex-cli-'
    + `${dateformat(new Date(), 'isoDateTime')}-`
    + utils.randomString(10);

  // create project
  const res1 = await api.projects.import(data);
  await utils.assertStatus(res1, 201);
  _project = await res1.json();

  console.log(chalk.white.dim(`Project ${_project.name} has been imported.`));

  // get symbols
  const res2 = await api.symbolGroups.getAll(_project.id);
  await utils.assertStatus(res2, 200);
  const groups = await res2.json();
  const symbols = [];
  const iterate = (group) => {
    group.symbols.forEach(s => symbols.push(s));
    group.groups.forEach(g => iterate(g));
  };
  groups.forEach(iterate);
  _symbolGroups = groups;
  _symbols = symbols;

  // get tests
  const res3 = await api.tests.getAll(_project.id);
  await utils.assertStatus(res3, 200);
  const root = await res3.json();

  _tests = root.tests;
}

/**
 * Create a new project with a random name.
 *
 * @return {*}
 */
async function createProject() {
  if (_project) {
    await _createProject(_project);
  } else {
    const data = {
      version: VERSION,
      type: 'project',
      project: {
        environments: []
      },
      groups: [],
      tests: _tests || [],
      formulaSuites: []
    };

    if (_symbols) {
      data.groups = [{
        name: 'Default Group',
        symbols: _symbols
      }];
    } else {
      data.groups = _symbolGroups;
    }

    const targets = program.targets;
    for (let i = 0; i < targets.length; i++) {
      data.project.environments.push({
        name: i === 0 ? 'Production' : `Env${i + 1}`,
        default: i === 0,
        urls: [{
          name: 'Base',
          url: targets[i],
          default: true
        }],
        variables: []
      })
    }

    await _createProject(data);
  }
}

/**
 * Upload files.
 *
 * @returns {Promise<void>}
 */
async function uploadFiles() {
  const queue = [..._files];

  async function next(file) {
    const res = api.files.upload(_project.id, fs.createReadStream(file));
    await utils.assertStatus(201, res);

    if (queue.length > 0) {
      await next(queue.shift());
    }
  }

  await next(queue.shift());
  console.log(chalk.white.dim(`Files have been uploaded.`));
}

/**
 * Write the learned model or test report into a file.
 *
 * @param {string} data The data to write into the file.
 */
function writeOutputFile(data) {
  const file = program.out;
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

  _config.tests = _tests.map(test => test.id);
  _config.environment = _project.environments[0].id;

  function printReport(report) {
    report.testResults.forEach(tr => {
      if (tr.passed) {
        console.log(`${chalk.bgGreen("success")} ${tr.test.name}`);
      } else {
        console.log(`${chalk.bgRed("failed")} ${tr.test.name}`);
      }
    });
  }

  // start test execution
  const res1 = await api.tests.execute(_project.id, _config);
  await utils.assertStatus(res1, 200);
  let report = (await res1.json()).report;

  // poll for result
  const startTime = Date.now();
  while (true) {
    const timeElapsed = Date.now() - startTime;
    console.log(chalk.white.dim(`Waiting for tests to finish... (${Math.floor(timeElapsed / 1000)}s elapsed)`));

    const res2 = await api.testReports.get(_project.id, report.id);
    await utils.assertStatus(res2, 200);
    report = await res2.json();

    if (report.status === 'IN_PROGRESS' || report.status === 'PENDING') {
      await utils.timeout(POLL_TIME_TESTING);
    } else {
      break;
    }
  }

  // print report to terminal
  printReport(report);

  const res3 = await api.testReports.get(_project.id, report.id, 'junit');
  await utils.assertStatus(res3, 200);

  // write junit test report in a file
  if (program.out) {
    writeOutputFile(res3.body);
  }

  if (report.passed) {
    console.log(chalk.green(`${report.numTestsPassed}/${report.numTests} tests passed.`));
  } else {
    throw `${report.numTestsFailed}/${report.numTests} tests failed.`;
  }
}


async function waitForLearnerToFinish(startTime, testNo) {
  while(true) {
    const timeElapsed = Date.now() - startTime;
    console.log(chalk.white.dim(`Wait for the learning process to finish... (${Math.floor(timeElapsed / 1000)}s elapsed)`));

    const res2 = await api.learnerResults.get(_project.id, testNo);
    await utils.assertStatus(res2, 200);
    let result = await res2.json();

    if (result.status === 'FINISHED' || result.status === 'ABORTED') {
      return result;
    } else {
      await utils.timeout(POLL_TIME_LEARNING);
    }
  }
}

async function startLearningFromConfig() {

  // symbolId -> parameterName -> parameter
  // needed to set the ids of the parameters by name
  const inputParamMap = {};
  _symbols.forEach(sym => {
    inputParamMap[sym.id] = inputParamMap[sym.id] == null ? {} : inputParamMap[sym.id];
    sym.inputs.forEach(input => {
      inputParamMap[sym.id][input.name] = input;
    });
  });

  const mapSymbolIds = (pSymbol) => {
    pSymbol.symbol = {id: _symbols.find(s => s.name === pSymbol.symbol.name).id};
    pSymbol.parameterValues.forEach(pv => {
      pv.parameter.id = inputParamMap[pSymbol.symbol.id][pv.parameter.name].id;
    })
  };

  _config.setup.symbols.forEach(mapSymbolIds);
  mapSymbolIds(_config.setup.preSymbol);
  if (_config.setup.postSymbol != null) {
    mapSymbolIds(_config.setup.postSymbol);
  }

  _config.setup.environments = _project.environments;

  const res1 = await api.learner.start(_project.id, _config);
  await utils.assertStatus(res1, 200);

  return await res1.json();
}

async function startLearningFromSetup() {
  const setupName = program.setup;

  const res1 = await api.learnerSetups.getAll(_project.id);
  await utils.assertStatus(res1, 200);

  const setups = await res1.json();
  const setupsWithRequiredName = setups.filter(s => s.name === setupName);

  if (setupsWithRequiredName.length === 0) {
    throw `There is no learner setup with the name "${setupName}" in the project.`;
  }

  const res2 = await api.learnerSetups.execute(_project.id, setupsWithRequiredName[0].id);
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
  let result;
  if (!program.setup) {
    result = await startLearningFromConfig();
  } else {
    result = await startLearningFromSetup();
  }

  // poll for learner result
  const startTime = Date.now();
  result = await waitForLearnerToFinish(startTime, result.testNo);
  console.log(chalk.white.dim(`The learning process finished.`));

  if (result.error) {
    throw 'The learning process finished with errors.';
  }

  // check model
  if (_formulas.length > 0) {
    console.log(chalk.white.dim(`Checking ${_formulas.length} LTL properties.`));

    while (true) {
      const checkResults = await checkLTLProperties(result);
      const failedCheckResults = checkResults.filter(cr => !cr.passed);

      if (failedCheckResults.length > 0) {

        // test if one of the counterexamples is an actual counterexample and refine the hypothesis
        console.log(chalk.white.dim(`${failedCheckResults.length}/${checkResults.length} LTL properties do${failedCheckResults.length === 1 ? 'es' : ''} not hold.`));
        console.log(chalk.white.dim(`Search for counterexamples in failed LTL properties...`));
        const ce = await findCounterexample(result, failedCheckResults);
        if (ce != null) {

          // refine the model with a sample eq oracle
          console.log(chalk.white.dim(`Counterexample found! Refine model with ${ce}.`));
          const res3 = await api.learner.refine(_project.id, result.testNo, {
            eqOracle: {
              type: "sample",
              batchSize: 1,
              counterExamples: [ce]
            },
            stepNo: result.steps[result.steps.length - 1].stepNo,
            symbolsToAdd: []
          });
          await utils.assertStatus(res3, 200);
          result = await waitForLearnerToFinish(startTime, result.testNo);

          if (result.error) {
            throw 'The learning process finished with errors.';
          }

          // continue until no LTL-based counterexamples could be found.
          continue;
        } else {
          console.log(chalk.white.dim(`No counterexamples found.`));
          assertCheckResults(checkResults);
        }
      } else {
        assertCheckResults(checkResults);
      }

      break;
    }
  }

  // write learned model to a file
  if (program.out) {
    const model = result.steps[result.steps.length - 1].hypothesis;
    writeOutputFile(JSON.stringify(model));
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
    throw `${numFailed}/${_formulas.length} LTL properties do${numFailed === 1 ? 'es' : ''} not hold.`;
  }
}

async function findCounterexample(result, checkResults) {
  for (let cr of checkResults) {
    if (!cr.passed) {
      const inputs = cr.prefix.concat(cr.loop);
      const hypOutput = await getHypOutput(result, inputs);
      const sulOutput = await getSulOutput(result, inputs);

      if (!utils.listsAreEqual(hypOutput, sulOutput)) {
        return inputs.map((input, i) => ({input, output: sulOutput[i]}));
      }
    }
  }

  return null;
}

async function getSulOutput(learnerResult, inputs) {

  const symbolIdMap = {};
  _symbols.forEach(s => symbolIdMap[s.id] = s);

  const symbolNameMap = {};
  _config.setup.symbols.forEach(ps => {
    ps.symbol.name = symbolIdMap[ps.symbol.id].name;
    symbolNameMap[getComputedName(ps)] = ps
  });

  const config = {
    preSymbol: _config.setup.preSymbol,
    symbols: inputs.map(sym => symbolNameMap[sym]),
    postSymbol: _config.setup.postSymbol,
    driverConfig: _config.setup.webDriver
  };

  const res = await api.projectEnvironments.getOutputs(_project.id, _config.setup.environments[0].id, config);
  await utils.assertStatus(res, 200);
  return await res.json();
}

async function getHypOutput(learnerResult, inputs) {
  const stepId = learnerResult.steps[learnerResult.steps.length - 1].id;
  const res = await api.learnerResultSteps.getHypothesisOutputs(_project.id, learnerResult.id, stepId, inputs);
  await utils.assertStatus(res, 200);
  return await res.json();
}

async function checkLTLProperties(result) {
  const config = {
    learnerResultId: result.testNo,
    stepNo: result.steps[result.steps.length - 1].stepNo,
    formulas: _formulas.map(f => ({
      formula: f
    })),
    formulaIds: [],
    minUnfolds: 3,
    multiplier: 1.0,
  };

  const res = await api.modelChecker.check(_project.id, config);
  await utils.assertStatus(res, 200);
  return await res.json();
}

function processProgram() {
  // process required options
  _action = processors.action(program.do);
  _uri = processors.uri(program.uri);
  _user = processors.user(program.user);
  if (program.config) {
    _config = processors.config(program.config);
  }

  // initialize api with given uri
  api.init(_uri);

  if (program.project) {
    if (program.targets || program.symbols || program.tests) {
      throw 'You cannot specify a project file and additional targets, symbols or tests.';
    }

    _project = processors.project(program.project);
  } else {
    // validate target URL
    if (!program.targets || program.targets.length === 0) {
      throw `You haven't specified the URL of the target application.`;
    }

    // validate symbols
    if (!program.symbols) {
      throw `You have to specify a file that contains symbols.`;
    } else {
      const data = processors.symbols(program.symbols);
      _symbols = data.symbols;
      _symbolGroups = data.symbolGroups;
    }
  }

  if (_action === 'test') {
    if (!program.config) {
      throw `You haven't specified a config file`;
    }

    if (program.formulas) {
      throw 'You may not specify ltl formulas when testing.';
    }

    if (!program.project) {
      // validate tests
      if (!program.tests) {
        throw 'You have to specify a file that contains tests.';
      } else {
        _tests = processors.tests(program.tests);
      }
    }
  } else if (_action === 'learn') {
    if (program.tests) {
      throw 'You want to learn, but have specified tests.';
    }

    if (program.setup && program.config) {
      throw 'You cannot specify a learner setup and a config file together.';
    }

    if (!program.setup && !program.config) {
      throw `You haven't specified a learner setup or a config file.`;
    }

    if (program.formulas) {
      _formulas = processors.formulas(program.formulas);
    }
  }

  if (program.files) {
    _files = processors.files(program.files);
  }
}

function getComputedName(s) {
  const params = s.parameterValues
    .filter(v => v.value != null)
    .map(v => v.value);

  if (params.length === 0) {
    return s.symbol.name;
  } else {
    return `${s.symbol.name} <${params.join(', ')}>`;
  }
}

module.exports = {
  run: async function(cjsProgram) {
    program = cjsProgram;

    processProgram();

    await api.auth(_user.email, _user.password);
    await createProject();

    if (_files.length > 0) {
      await uploadFiles();
    }

    if (_action === 'test') {
      await startTesting();
    } else {
      await startLearning();
    }

    if (program.cleanUp) {
      const res = await api.projects.delete(_project.id);
      await utils.assertStatus(res, 204)
      console.log(chalk.white.dim(`The project has been deleted.`));
    }
  }
}