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
  request = require('request-promise-native'),
  chalk = require('chalk'),
  fs = require('fs'),
  nPath = require('path'),
  dateformat = require('dateformat');

const VERSION = '1.8.0-SNAPSHOT';

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
  .option('-a, --action [action]', 'What do you want to do with ALEX? [test|learn]')
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


/**
 * Login a user.
 *
 * @param {{email:string, password:string}} user
 * @return {*}
 */
function login(user) {
  return request({
    method: 'POST',
    uri: `${_uri}/users/login`,
    headers: _getDefaultHttpHeaders(),
    body: JSON.stringify(user)
  });
}

function _createProject(data) {
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

  return request({
    method: 'POST',
    uri: `${_uri}/projects/import`,
    headers: _getDefaultHttpHeaders(),
    body: JSON.stringify(data)
  }).then(data => {
    _project = JSON.parse(data);
    _environments = _project.environments;

    return request({
      method: 'GET',
      uri: `${_uri}/projects/${_project.id}/groups`,
      headers: _getDefaultHttpHeaders()
    }).then(data => {
      const groups = JSON.parse(data);
      const symbols = [];
      const iterate = (group) => {
        group.symbols.forEach(s => symbols.push(s));
        group.groups.forEach(g => iterate(g));
      };
      groups.forEach(iterate);

      _symbolGroups = groups;
      _symbols = symbols;

      return request({
        method: 'GET',
        uri: `${_uri}/projects/${_project.id}/tests/root`,
        headers: _getDefaultHttpHeaders()
      }).then(data => {
        _tests = JSON.parse(data).tests;
        return _tests;
      });
    });
  });
}

/**
 * Create a new project with a random name.
 *
 * @return {*}
 */
function createProject() {
  if (_project) {
    return _createProject(_project);
  } else {
    const data = {
      version: VERSION,
      type: 'project',
      project: {
        environments: []
      },
      groups: [],
      tests: _tests || []
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

    return _createProject(data);
  }
}

/**
 * Delete the project that has been created.
 *
 * @return {Promise<*>}
 */
function deleteProject() {
  return new Promise((resolve, reject) => {
    request({
      method: 'DELETE',
      uri: `${_uri}/projects/${_project.id}`,
      headers: _getDefaultHttpHeaders()
    }).then(resolve).catch(reject);
  });
}

/**
 * Upload files.
 *
 * @returns {Promise<*>}
 */
function uploadFiles() {
  return new Promise((resolve, reject) => {
    const headers = JSON.parse(JSON.stringify(_getDefaultHttpHeaders()));
    headers['Content-Type'] = 'multipart/form-data';

    const queue = [..._files];

    const next = (file => {
      request({
        headers,
        method: 'POST',
        uri: `${_uri}/projects/${_project.id}/files/upload`,
        formData: {
          file: fs.createReadStream(file)
        }
      }).then(() => {
        if (queue.length === 0) {
          resolve();
        } else {
          next(queue.shift());
        }
      }).catch(reject);
    });

    next(queue.shift());
  });
}

/**
 * Execute a single test.
 *
 * @return {*}
 */
function executeTests() {
  return request({
    method: 'POST',
    uri: `${_uri}/projects/${_project.id}/tests/execute`,
    headers: _getDefaultHttpHeaders(),
    body: JSON.stringify(_config)
  });
}

function getTestReport(reportId) {
  return request({
    method: 'GET',
    uri: `${_uri}/projects/${_project.id}/tests/reports/${reportId}`,
    headers: _getDefaultHttpHeaders()
  });
}

/**
 * Get the report as JUnit XML.
 * @param {number} reportId The ID of the test report.
 */
function getJUnitReport(reportId) {
  return request({
    method: 'GET',
    uri: `${_uri}/projects/${_project.id}/tests/reports/${reportId}?format=${encodeURIComponent('junit')}`,
    headers: _getDefaultHttpHeaders()
  });
}

/**
 * Get the latest learner result.
 * Should be called after the learning process is finished.
 * @return {*}
 */
function getLearnerResult(resultId) {
  return request({
    method: 'GET',
    uri: `${_uri}/projects/${_project.id}/results/${resultId}?embed=steps`,
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
function startTesting() {
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

  return new Promise((resolve, reject) => {
    executeTests(_tests)
      .then(res => {
        const reportId = JSON.parse(res).report.id;

        function poll() {
          getTestReport(reportId)
            .then(res1 => {
              const report = JSON.parse(res1);
              if (report.status === 'IN_PROGRESS' || report.status === 'PENDING') {
                setTimeout(poll, POLL_TIME_TESTING);
              } else {
                printReport(report);
                getJUnitReport(report.id)
                  .then(res3 => {
                    writeOutputFile(res3);
                  })
                  .catch(err => {
                    reject('Could not get junit report');
                  })
                  .finally(() => {
                    if (report.passed) {
                      resolve(`${report.numTestsPassed}/${report.numTests} tests passed.`);
                    } else {
                      reject(`${report.numTestsFailed}/${report.numTests} tests failed.`);
                    }
                  });
              }
            }).catch(reject);
        }

        poll();
      })
      .catch(reject);
  });
}

/**
 * Start learning.
 *
 * @return {Promise<*>}
 */
function startLearning() {

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

  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      uri: `${_uri}/projects/${_project.id}/learner/start`,
      headers: _getDefaultHttpHeaders(),
      body: JSON.stringify(_config)
    }).then(res => {
      const testNo = JSON.parse(res).testNo;

      const poll = () => {
        getLearnerResult(testNo)
          .then(res2 => {
            const result = JSON.parse(res2);
            if (result.status === 'FINISHED' || result.status === 'ABORTED') {
              if (!result.error) {
                writeOutputFile(JSON.stringify(result.steps[result.steps.length - 1].hypothesis));
                resolve('The learning process finished.');
              } else {
                reject();
              }
            } else {
              setTimeout(poll, POLL_TIME_LEARNING);
            }
          })
          .catch(reject);
      };
      poll();
    }).catch(reject);
  });
}

try {
  // validate the action
  if (!program.action) {
    throw 'You haven\'t specified what action to execute. It can either be \'test\' or \'learn\'.';
  } else {
    if (['test', 'learn'].indexOf(program.action.trim()) === -1) {
      throw 'You have specified an invalid action. It can either be \'test\' or \'learn\'.';
    } else {
      _action = program.action;
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

/**
 * The function that is called if the tests have been executed or the learning process finished.
 * Removes the project that has been created temporarily.
 *
 * @param {string} message The message to print after the cli terminates.
 * @param {Function} fn The callback that processes the message.
 */
function terminate(message, fn) {
  if (program.cleanUp) {
    deleteProject()
      .then(() => {
        console.log(chalk.white.dim(`Project has been deleted.`));
        fn(message);
      })
      .catch(() => fn(message));
  } else {
    fn(message);
  }
}

// execute the tests / learning process
login(_user).then((data) => {
  _jwt = JSON.parse(data).token;
  console.log(chalk.white.dim(`User "${_user.email}" logged in.`));

  function progress() {
    if (_action === 'test') {
      console.log(chalk.white.dim(`Executing tests...`));
      return startTesting();
    } else {
      console.log(chalk.white.dim(`Start learning...`));
      return startLearning();
    }
  }

  return createProject().then(() => {
    console.log(chalk.white.dim(`Project ${_project.name} has been imported.`));

    if (_files.length > 0) {
      return uploadFiles().then(() => {
        console.log(chalk.white.dim(`Files have been uploaded.`));
        return progress()
      })
    } else {
      return progress();
    }
  });
}).then((result) => {
  terminate(result, (message) => {
    console.log(chalk.green(message));
    process.exit(0);
  });
}).catch((err) => {
  terminate(err, (message) => {
    console.log(chalk.red(message));
    process.exit(1);
  });
});
