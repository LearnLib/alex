/*
 * Copyright 2016 TU Dortmund
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
    fs = require('fs');

function credentials(value) {
    const parts = value.split(':');
    return {
        email: parts.shift(),
        password: parts.join('')
    }
}

program
    .version('1.0.0')
    .option('--uri [uri]', 'The URI where ALEX is running without trailing \'/\'')
    .option('--target [target]', 'The base URL of the target application')
    .option('-u, --user [credentials]', '<email>:<password>', credentials)
    .option('-s, --symbols [file]', 'Add the json file that contains all necessary symbols')
    .option('-t, --tests [file]', 'Add the json file that contains all tests that should be executed')
    .parse(process.argv);

/**
 * The uri of the server where the backend of ALEX is running
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
 * @type {{name: string: baseUrl: string, id: number}|null}
 * @private
 */
let _project = null;

/**
 * The list of symbols that are required for the tests.
 *
 * @type {{name: string, actions: object[], id: number}[]|null}
 * @private
 */
let _symbols = null;

/**
 * The test cases that should be executed.
 *
 * @type {{id:number, name:string}[]|null}
 * @private
 */
let _tests = null;


/**
 * Login a user.
 *
 * @param user
 * @return {*}
 */
function login(user) {
    return request({
        method: 'POST',
        uri: _uri + '/users/login',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

/**
 * Create a new project with a random name.
 *
 * @return {*}
 */
function createProject() {
    function createProjectName() {
        let text = "cli-";
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 24; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return text;
    }

    return request({
        method: 'POST',
        uri: _uri + '/projects',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _jwt
        },
        body: JSON.stringify({
            name: createProjectName(),
            baseUrl: program.target
        })
    });
}

/**
 * Delete the project that has been created.
 *
 * @return {Promise<any>}
 */
function deleteProject() {
    return new Promise((resolve, reject) => {
        request({
            method: 'DELETE',
            uri: _uri + `/projects/${_project.id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + _jwt
            }
        }).then(resolve).catch(reject);
    });
}

/**
 * Create the symbols from the file.
 *
 * @return {*}
 */
function createSymbols() {
    return request({
        method: 'POST',
        uri: _uri + `/projects/${_project.id}/symbols/batch`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _jwt
        },
        body: JSON.stringify(_symbols)
    });
}

/**
 * Create the tests that are specified in the file.
 *
 * @return {*}
 */
function createTests() {
    _tests.forEach(t => {
        t.parent = null;
        t.project = _project.id;
        t.symbols = t.symbols.map(name => {
            const sym = _symbols.find(s => s.name === name);
            if (sym) return sym.id;
        });
    });

    return request({
        method: 'POST',
        uri: _uri + `/projects/${_project.id}/tests/batch`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _jwt
        },
        body: JSON.stringify(_tests)
    })
}

/**
 * Execute a single test.
 *
 * @param test The test to execute.
 * @return {*}
 */
function executeTest(test) {
    return request({
        method: 'POST',
        uri: _uri + `/projects/${_project.id}/tests/${test.id}/execute`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _jwt
        },
        body: JSON.stringify({
            driver: 'chrome',
            width: 1280,
            height: 720,
            headless: true
        })
    });
}

/**
 * Execute all tests.
 *
 * @return {Promise<any>}
 */
function executeTests() {
    return new Promise((resolve, reject) => {
        let numTests = _tests.length;
        let testsFailed = 0;
        let success = true;

        const next = test => {
            executeTest(test).then(result => {
                result = JSON.parse(result);
                success &= result.success;

                if (!result.success) {
                    testsFailed++;
                }

                console.log(`${result.success ? chalk.white.bgGreen('passed') : chalk.white.bgRed('failed')} \t ${test.name}`);

                _tests.shift();
                if (_tests.length) {
                    next(_tests[0]);
                } else {
                    if (success) {
                        resolve(`${numTests}/${numTests} tests passed.`);
                    } else {
                        reject(`${testsFailed}/${numTests} tests failed.`);
                    }
                }
            }).catch(reject);
        };

        next(_tests[0]);
    });
}


try {
    // validate ALEX URI
    if (!program.uri) {
        throw "You haven't specified the URI where the server of ALEX is running.";
    } else {
        _uri = program.uri + '/rest';
    }

    // validate target URL
    if (!program.target) {
        throw "You haven't specified the URL of the target application.";
    }

    // validate user credentials
    if (!program.user) {
        throw "You haven't specified a user.";
    } else {
        const user = program.user;
        if (!user.email || user.email.trim() === '' || !user.password || user.password.trim() === '') {
            throw "Email or password are not defined or empty.";
        } else {
            _user = program.user;
        }
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
            const symbols = JSON.parse(contents);
            if (!symbols.length) {
                throw 'The file that you specified does not seem to contain any symbols.';
            } else {
                _symbols = symbols;
            }
        }
    }

    // validate tests
    if (!program.tests) {
        throw 'You have to specify a file that contains tests.';
    } else {
        const file = program.tests;
        if (!fs.existsSync(file)) {
            throw 'The file for the tests that you specified cannot be found.';
        } else {
            const contents = fs.readFileSync(file);
            const tests = JSON.parse(contents);
            if (!tests.length) {
                throw 'The file that you specified does not seem to contain any tests.';
            } else {
                _tests = tests;
            }
        }
    }
} catch (exception) {
    console.log(chalk.red(exception));
    process.exit(0);
}

// process inputs
login(_user).then(data => {
    _jwt = JSON.parse(data).token;
    return createProject().then(data => {
        _project = JSON.parse(data);
        return createSymbols().then(data => {
            _symbols = JSON.parse(data);
            return createTests().then(data => {
                _tests = JSON.parse(data);
                return executeTests();
            })
        });
    });
}).then(result => {
    const success = msg => {
        console.log(chalk.green(msg));
        process.exit(0);
    };

    deleteProject()
        .then(() => success(result))
        .catch(() => success(result));
}).catch(err => {
    const failure = msg => {
        console.log(chalk.red(msg));
        process.exit(1);
    };

    deleteProject()
        .then(() => failure(err))
        .catch(() => failure(err));
});