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

module.exports = {

  /**
   * Assert the status code of an HTTP response.
   * Throws an error if the expected and actual code do not match.
   *
   * @param res The HTTP response.
   * @param status The expected status code.
   * @returns {Promise<void>}
   */
  assertStatus: async function(res, status) {
    if (res.status !== status) {
      const body = await res.json();
      throw body.data.message;
    }
  },

  /**
   * Async function for window.setTimeout.
   *
   * @param ms The amount of milliseconds to wait.
   * @returns {Promise<unknown>}
   */
  timeout: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Generate a random string of a specific length.
   *
   * @param len The length of the string.
   * @returns {string}
   */
  randomString: function(len) {
    let str = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  }
}