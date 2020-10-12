#!/usr/bin/env node

/*
 * Copyright 2018 - 2019 TU Dortmund
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

const program = require('commander'),
  fetch = require('node-fetch'),
  chalk = require('chalk'),
  fs = require('fs'),
  nPath = require('path'),
  dateformat = require('dateformat');

const VERSION = '2.0.0';

/**
 * Parse user credentials from a string.
 * The string should be "email:password".
 *
 * @param {string} value The credentials.
 * @return {{email: string, password: string}}
 */
function credentials(value) {
  const parts = value.split(':');
  return {
    email: parts.shift(),
    password: parts.join('')
  };
}

program
  .version(VERSION)
  .option('--uri [uri]', 'The URI where ALEX is running without trailing \'/\'')
  .option('--targets [targets]', 'The base URL and mirrors of the target application as comma separated list')
  .option('--clean-up', 'If the project is deleted after a test or learning process')
  .option('-d --do, [do]', 'What do you want to do with ALEX? [test|learn]')
  .option('-u, --user [credentials]', 'Credentials with the pattern "email:password"', credentials)
  .option('-p, --project [file]', 'Add the json file that contains a project. Cannot be used in combination with \'-s\', \'-t\' and \'--targets\'')
  .option('-s, --symbols [file]', 'Add the json file that contains all necessary symbols')
  .option('-t, --tests [file]', 'Add the json file that contains all tests that should be executed. Omit this if you want to learn.')
  .option('-c, --config [file]', 'Add the json file that contains the configuration for the web driver')
  .option('-f --files [files]', 'A file or directory that contains files to upload to ALEX')
  .option('-o --out [file]', 'A file where test reports and learned models are written to')
  .parse(process.argv);

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
 * The URI of the server where the backend of ALEX is running.
 *
 * @type {string|null}
 * @private
 */
let _uri = null;

/**
 * The jwt of the user that logs in.
 *
 * @type {string|null}
 * @private
 */
let _jwt = null;

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
 * The environments in the project.
 *
 * @type {Array}
 * @private
 */
let _environments = [];

/**
 * Create the default headers send to ALEX
 *
 * @returns {*}
 * @private
 */
function _getDefaultHttpHeaders() {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (_jwt != null) {
    headers['Authorization'] = `Bearer ${_jwt}`;
  }
  return headers;
}


async function assertStatus(res, status) {
  if (res.status !== status) {
    const body = await res.json();
    throw body.data.message;
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Login a user.
 *
 * @param {{email:string, password:string}} user
 * @return {*}
 */
async function login(user) {
  const res = await fetch(`${_uri}/users/login`, {
    method: 'post',
    headers: _getDefaultHttpHeaders(),
    body: JSON.stringify(user)
  });
  assertStatus(res, 200);

  const data = await res.json();
  _jwt = data.token;

  console.log(chalk.white.dim(`User "${_user.email}" logged in.`));
}

async function _createProject(data) {
  function createProjectName() {
    let text = 'alex-cli-';

    text += dateformat(new Date(), 'isoDateTime') + '-';

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return text;
  }

  data.project.name = createProjectName();

  // create project
  const res1 = await fetch(`${_uri}/projects/import`, {
    method: 'post',
    headers: _getDefaultHttpHeaders(),
    body: JSON.stringify(data)
  });
  assertStatus(res1, 201);

  _project = await res1.json();
  _environments = _project.environments;

  console.log(chalk.white.dim(`Project ${_project.name} has been imported.`));

  // get symbols
  const res2 = await fetch(`${_uri}/projects/${_project.id}/groups`, {
    method: 'get',
    headers: _getDefaultHttpHeaders()
  });
  assertStatus(res2, 200);

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
  const res3 = await fetch(`${_uri}/projects/${_project.id}/tests/root`, {
    method: 'get',
    headers: _getDefaultHttpHeaders()
  });
  assertStatus(res3, 200);

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

    const targets = program.targets.split(',');
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
 * Delete the project that has been created.
 *
 * @return {Promise<*>}
 */
async function deleteProject() {
  const res = await fetch(`${_uri}/projects/${_project.id}`,{
      method: 'delete',
      headers: _getDefaultHttpHeaders()
  });
  assertStatus(res, 204)
  console.log(chalk.white.dim(`Project has been deleted.`));
}

/**
 * Upload files.
 *
 * @returns {Promise<*>}
 */
async function uploadFiles() {
  const headers = JSON.parse(JSON.stringify(_getDefaultHttpHeaders()));
  headers['Content-Type'] = 'multipart/form-data';

  const queue = [..._files];

  async function next(file) {
    const res = await fetch(`${_uri}/projects/${_project.id}/files/upload`,{
        headers,
        method: 'post',
        formData: {
          file: fs.createReadStream(file)
        }
    });
    assertStatus(201, res);

    if (queue.length > 0) {
      await next(queue.shift());
    }
  }

  await next(queue.shift());
  console.log(chalk.white.dim(`Files have been uploaded.`));
}

/**
 * Execute a single test.
 *
 * @return {*}
 */
function executeTests() {
  return fetch(`${_uri}/projects/${_project.id}/tests/execute`,{
    method: 'post',
    headers: _getDefaultHttpHeaders(),
    body: JSON.stringify(_config)
  });
}

/**
 * Get the test report.
 *
 * @param reportId The ID of the report
 * @returns {Promise<void>}
 */
function getTestReport(reportId) {
  return fetch(`${_uri}/projects/${_project.id}/tests/reports/${reportId}`, {
    method: 'get',
    headers: _getDefaultHttpHeaders()
  });
}

/**
 * Get the report as JUnit XML.
 * @param {number} reportId The ID of the test report.
 */
function getJUnitReport(reportId) {
  return  fetch(`${_uri}/projects/${_project.id}/tests/reports/${reportId}?format=${encodeURIComponent('junit')}`, {
    method: 'get',
    headers: _getDefaultHttpHeaders()
  });
}

/**
 * Get the latest learner result.
 * Should be called after the learning process is finished.
 * @return {*}
 */
function getLearnerResult(resultId) {
  return fetch(`${_uri}/projects/${_project.id}/results/${resultId}?embed=steps`, {
    method: 'get',
    headers: _getDefaultHttpHeaders()
  });
}

/**
 * Write the learned model or test report into a file.
 *
 * @param {string} data The data to write into the file.
 */
function writeOutputFile(data) {
  if (program.out) {
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

  const res1 = await executeTests(_tests);
  assertStatus(res1, 200);
  let report = (await res1.json()).report;

  while (true) {
    console.log(chalk.white.dim(`Waiting for tests to finish...`));

    const res2 = await getTestReport(report.id);
    assertStatus(res2, 200);
    report = await res2.json();

    if (report.status === 'IN_PROGRESS' || report.status === 'PENDING') {
      await timeout(POLL_TIME_TESTING);
    } else {
      break;
    }
  }

  printReport(report);
  const res3 = await getJUnitReport(report.id);
  writeOutputFile(res3.body);

  if (report.passed) {
    console.log(chalk.green(`${report.numTestsPassed}/${report.numTests} tests passed.`));
  } else {
    throw `${report.numTestsFailed}/${report.numTests} tests failed.`;
  }
}

/**
 * Start learning.
 *
 * @return {Promise<*>}
 */
async function startLearning() {
  console.log(chalk.white.dim(`Start learning...`));

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

  _config.setup.environments = _environments;

  const res1 = await fetch(`${_uri}/projects/${_project.id}/learner/start`, {
    method: 'post',
    headers: _getDefaultHttpHeaders(),
    body: JSON.stringify(_config)
  });
  assertStatus(res1, 200);

  const testNo = (await res1.json()).testNo;

  while(true) {
    console.log(chalk.white.dim(`Wait for the learning process to finish...`));

    const res2 = await getLearnerResult(testNo);
    const result = await res2.json();

    if (result.status === 'FINISHED' || result.status === 'ABORTED') {
      if (!result.error) {
        writeOutputFile(JSON.stringify(result.steps[result.steps.length - 1].hypothesis));
        console.log(chalk.green('The learning process finished successfully.'));
        break;
      } else {
        throw 'The learning process finished with errors';
      }
    } else {
      await timeout(POLL_TIME_LEARNING);
    }
  }
}

try {
  // validate the action
  if (!program.do) {
    throw 'You haven\'t specified what action to execute. It can either be \'test\' or \'learn\'.';
  } else {
    if (['test', 'learn'].indexOf(program.do.trim()) === -1) {
      throw 'You have specified an invalid action. It can either be \'test\' or \'learn\'.';
    } else {
      _action = program.do;
    }
  }

  // validate ALEX URI
  if (!program.uri) {
    throw 'You haven\'t specified the URI where the server of ALEX is running.';
  } else {
    _uri = program.uri + '/rest';
  }

  if (program.project) {
    if (program.targets || program.symbols || program.tests) {
      throw 'You cannot specify a project file and additional targets, symbols or tests';
    }

    const file = program.project;
    if (!fs.existsSync(file)) {
      throw 'You haven\'t specified the file for project to import.';
    } else {
      _project = JSON.parse(fs.readFileSync(file));
    }
  } else {
    // validate target URL
    if (!program.targets) {
      throw 'You haven\'t specified the URL of the target application.';
    }

    // validate symbols
    if (!program.symbols) {
      throw 'You have to specify a file that contains symbols.';
    } else {
      const file = program.symbols;
      if (!fs.existsSync(file)) {
        throw 'The file for the symbols that you specified cannot be found.';
      } else {
        const contents = fs.readFileSync(file);
        const data = JSON.parse(contents);
        if (data.type === 'symbols' && data.symbols != null && data.symbols.length > 0) {
          _symbols = data.symbols;
        } else if (data.type === 'symbolGroups' && data.symbolGroups != null && data.symbolGroups.length > 0) {
          _symbolGroups = data.symbolGroups;
        } else {
          throw 'The file that you specified does not seem to contain any symbols.';
        }
      }
    }
  }

  // validate user credentials
  if (!program.user) {
    throw 'You haven\'t specified a user.';
  } else {
    const user = program.user;
    if (!user.email || user.email.trim() === '' || !user.password || user.password.trim() === '') {
      throw 'Email or password are not defined or empty.';
    } else {
      _user = program.user;
    }
  }

  // check if the config file exists
  if (!program.config) {
    throw 'You haven\'t specified config file for the web driver.';
  } else {
    const file = program.config;
    if (!fs.existsSync(file)) {
      throw 'The file for the web driver config cannot be found.';
    } else {
      const contents = fs.readFileSync(file);
      _config = JSON.parse(contents);
    }
  }

  if (_action === 'test') {
    if (!program.project) {
      // validate tests
      if (!program.tests) {
        throw 'You have to specify a file that contains tests.';
      } else {
        const file = program.tests;
        if (!fs.existsSync(file)) {
          throw 'The file for the tests that you specified cannot be found.';
        } else {
          const contents = fs.readFileSync(file);
          const data = JSON.parse(contents);
          if (data.tests == null || data.tests.length === 0) {
            throw 'The file that you specified does not seem to contain any tests.';
          } else {
            _tests = data.tests;
          }
        }
      }
    }
  } else {
    if (program.tests) {
      throw 'You want to learn, but have specified tests.';
    }
  }

  if (program.files) {
    const path = program.files;

    let stat;
    try {
      stat = fs.lstatSync(path);
      if (stat.isFile()) {
        _files = [path];
      } else if (stat.isDirectory()) {
        _files = fs.readdirSync(path).map(f => nPath.join(path, f));
      }
    } catch (e) {
      console.log(chalk.italic.yellow('The file or directory that contains files could not be found'));
    }
  }
} catch (exception) {
  console.log(chalk.red(exception));
  process.exit(1);
}


async function main() {
  await login(_user);
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
    await deleteProject();
  }
}

(async () => {
  try {
    await main();
    process.exit(0);
    console.log(chalk.green('CLI terminated successfully'));
  } catch (e) {
    console.log(chalk.red(e));
    process.exit(1);
  }
})();