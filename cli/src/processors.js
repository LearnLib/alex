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
   * Process the model files.
   *
   * @param {string[]} values
   * @returns {any[]} The model files
   */
  models: function(values) {
    return values
      .map(v => v.trim())
      .map(v => {
        if (!fs.existsSync(v)) {
          throw `The model file ${v} does not exist.`;
        } else {
          return JSON.parse(fs.readFileSync(v));
        }
      });
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
}