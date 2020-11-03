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
const nPath = require('path');

module.exports = {

  /**
   * Process the target URI.
   *
   * @param value The user input.
   * @returns {string} The API URL.
   */
  uri: function(value) {
    if (!value.match(/https?:\/\/.+?/gi)) {
      throw 'The URL is not properly formatted.';
    }
    return `${value}${value.endsWith('/') ? '' : '/'}rest`;
  },

  /**
   * Process the config file.
   *
   * @param value The path to the config file.
   * @returns {any} The JSON contents of the config file.
   */
  config: function(value) {
    if (!fs.existsSync(value)) {
      throw 'The file for the web driver config cannot be found.';
    } else {
      const contents = fs.readFileSync(value);
      return JSON.parse(contents);
    }
  },

  /**
   * Process the credentials.
   *
   * @param value The user input
   * @returns {{password: string, email: string}}
   */
  user: function(value) {
    const parts = value.split(':');
    const user = {
      email: parts.shift(),
      password: parts.join('')
    };

    if (!user.email || user.email.trim() === '' || !user.password || user.password.trim() === '') {
      throw 'Email or password are not defined or empty.';
    }

    return user;
  },

  /**
   * Process the action.
   *
   * @param value The user input.
   * @returns {string}
   */
  action: function(value) {
    if (['test', 'learn'].indexOf(value.trim()) === -1) {
      throw `You have specified an invalid action. It can either be 'test' or 'learn'.`;
    } else {
      return value;
    }
  },

  /**
   * Process files to upload.
   * Verifies if the files exist.
   *
   * @param value The user input.
   * @returns {string[]} The paths to the files to upload.
   */
  files: function(value) {
    const path = value;

    let stat = fs.lstatSync(path);
    if (stat.isFile()) {
      return [path];
    } else if (stat.isDirectory()) {
      return fs.readdirSync(path).map(f => nPath.join(path, f));
    }
  },

  /**
   * Process the project file.
   *
   * @param value The path to the project file.
   * @returns {any} The project.
   */
  project: function(value) {
    if (!fs.existsSync(value)) {
      throw `You haven't specified the file for project to import.`;
    } else {
      return JSON.parse(fs.readFileSync(value));
    }
  },

  /**
   * Process the symbols file.
   *
   * @param value The path to the symbols file.
   * @returns {{symbols: [], symbolGroups: []}}
   */
  symbols: function(value) {
    const result = {
      symbols: [],
      symbolGroups: []
    };

    if (!fs.existsSync(value)) {
      throw 'The file for the symbols that you specified cannot be found.';
    } else {
      const contents = fs.readFileSync(value);
      const data = JSON.parse(contents);
      if (data.type === 'symbols' && data.symbols != null && data.symbols.length > 0) {
        result.symbols = data.symbols;
      } else if (data.type === 'symbolGroups' && data.symbolGroups != null && data.symbolGroups.length > 0) {
        result.symbolGroups = data.symbolGroups;
      } else {
        throw 'The file that you specified does not seem to contain any symbols.';
      }
    }

    return result;
  },

  /**
   * Process the tests file.
   *
   * @param value The path to the file that contains tests.
   * @returns {any} The tests.
   */
  tests: function(value) {
    if (!fs.existsSync(value)) {
      throw 'The file for the tests that you specified cannot be found.';
    } else {
      const contents = fs.readFileSync(value);
      const data = JSON.parse(contents);
      if (data.tests == null || data.tests.length === 0) {
        throw 'The file that you specified does not seem to contain any tests.';
      } else {
        return data.tests;
      }
    }
  },

  /**
   * Process the formulas file.
   *
   * @param value The path to the file that contains ltl formulas.
   * @returns {*[]} The formulas.
   */
  formulas: function(value) {
    if (!fs.existsSync(value)) {
      throw 'The file for the ltl that you specified cannot be found.';
    } else {
      const contents = fs.readFileSync(value);
      const data = JSON.parse(contents);
      if (!data.length) {
        throw 'The file that you specified does not seem to contain any tests.';
      } else {
        return data;
      }
    }
  }
}