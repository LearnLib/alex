const chalk = require('chalk');

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

const fetch = require('node-fetch');
const utils = require("./utils");

/**
 * The token of an authenticated user.
 *
 * @type {string|null}
 * @private
 */
let _jwt = null;

/**
 * The base URL of the ALEX API.
 *
 * @type {string|null}
 * @private
 */
let _uri = null;

/**
 * Create the default headers that are send to ALEX.
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

module.exports = {
  init: function(uri) {
    _uri = uri;
  },
  auth: async function(email, password) {
    const res = await fetch(`${_uri}/users/login`, {
      method: 'post',
      headers: _getDefaultHttpHeaders(),
      body: JSON.stringify({email, password})
    });
    await utils.assertStatus(res, 200);

    // get the token
    const data = await res.json();
    _jwt = data.token;

    console.log(chalk.white.dim(`User "${email}" logged in.`));
  },
  projects: {
    import: async function(project) {
      return fetch(`${_uri}/projects/import`, {
        method: 'post',
        headers: _getDefaultHttpHeaders(),
        body: JSON.stringify(project)
      });
    },
    delete: async function(projectId) {
      return fetch(`${_uri}/projects/${projectId}`,{
        method: 'delete',
        headers: _getDefaultHttpHeaders()
      });
    }
  },
  projectEnvironments: {
    getOutputs: async function(projectId, envId, config) {
      return fetch(`${_uri}/projects/${projectId}/environments/${envId}/outputs`, {
        method: 'post',
        headers: _getDefaultHttpHeaders(),
        body: JSON.stringify(config)
      });
    }
  },
  symbolGroups: {
    getAll: async function(projectId) {
      return fetch(`${_uri}/projects/${projectId}/groups`, {
        method: 'get',
        headers: _getDefaultHttpHeaders()
      });
    }
  },
  learnerSetups: {
    getAll: async function(projectId) {
      return fetch(`${_uri}/projects/${projectId}/learner/setups`, {
        method: 'get',
        headers: _getDefaultHttpHeaders()
      });
    },
    execute: async function(projectId, setupId) {
      return fetch(`${_uri}/projects/${projectId}/learner/setups/${setupId}/run`, {
        method: 'post',
        headers: _getDefaultHttpHeaders()
      });
    }
  },
  learnerResults: {
    get: async function(projectId, resultId) {
      return fetch(`${_uri}/projects/${projectId}/results/${resultId}?embed=steps`, {
        method: 'get',
        headers: _getDefaultHttpHeaders()
      });
    }
  },
  learnerResultSteps: {
    getHypothesisOutputs: async function(projectId, resultId, stepId, inputs) {
      return fetch(`${_uri}/projects/${projectId}/results/${resultId}/steps/${stepId}/hypothesis/outputs`, {
        method: 'post',
        headers: _getDefaultHttpHeaders(),
        body: JSON.stringify(inputs)
      });
    }
  },
  tests: {
    getAll: async function(projectId) {
      return fetch(`${_uri}/projects/${projectId}/tests/root`, {
        method: 'get',
        headers: _getDefaultHttpHeaders()
      });
    },
    execute: async function(projectId, config) {
      return fetch(`${_uri}/projects/${projectId}/tests/execute`,{
        method: 'post',
        headers: _getDefaultHttpHeaders(),
        body: JSON.stringify(config)
      });
    }
  },
  testSetups: {
    getAll: async function(projectId) {
      return fetch(`${_uri}/projects/${projectId}/testConfigs`, {
        method: 'get',
        headers: _getDefaultHttpHeaders()
      });
    },
    execute: async function(projectId, setupId) {
      return fetch(`${_uri}/projects/${projectId}/testConfigs/${setupId}/run`, {
        method: 'post',
        headers: _getDefaultHttpHeaders()
      });
    }
  },
  testReports: {
    get: async function(projectId, testReportId, format) {
      const params = format ? `?format=${encodeURIComponent(format)}` : '';
      return fetch(`${_uri}/projects/${projectId}/tests/reports/${testReportId}${params}`, {
        method: 'get',
        headers: _getDefaultHttpHeaders()
      });
    }
  },
  files: {
    upload: async function(projectId, file) {
      const headers = JSON.parse(JSON.stringify(_getDefaultHttpHeaders()));
      headers['Content-Type'] = 'multipart/form-data';

      return fetch(`${_uri}/projects/${projectId}/files/upload`,{
        headers,
        method: 'post',
        formData: {
          file
        }
      });
    }
  },
  learner: {
    start: async function(projectId, config) {
      return fetch(`${_uri}/projects/${projectId}/learner/start`, {
        method: 'post',
        headers: _getDefaultHttpHeaders(),
        body: JSON.stringify(config)
      });
    },
    refine: async function(projectId, resultId, config) {
      return fetch(`${_uri}/projects/${projectId}/learner/${resultId}/resume`, {
        method: 'post',
        headers: _getDefaultHttpHeaders(),
        body: JSON.stringify(config)
      });
    },
    calculateSeparatingWord: async function(models) {
      return fetch(`${_uri}/projects/0/learner/compare/separatingWord`, {
        method: 'post',
        headers: _getDefaultHttpHeaders(),
        body: JSON.stringify(models)
      });
    }
  },
  modelChecker: {
    check: async function(projectId, config) {
      return fetch(`${_uri}/projects/${projectId}/modelChecker/check`, {
        method: 'post',
        headers: _getDefaultHttpHeaders(),
        body: JSON.stringify(config)
      });
    }
  }
};