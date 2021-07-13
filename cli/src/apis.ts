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

import fetch, { Response } from 'node-fetch';
import { getJwt, getUrl } from './context';

/**
 * Create the default headers that are send to ALEX.
 *
 * @returns {*}
 */
const getDefaultHttpHeaders = (): { [key: string]: string; } => {
  const headers: { [key: string]: string; } = {};
  headers['Content-Type'] = 'application/json';
  if (getJwt() != null) {
    headers['Authorization'] = `Bearer ${getJwt()}`;
  }
  return headers;
};

export const userApi = {
  login: async (email: string, password: string): Promise<Response> =>
    fetch(`${getUrl()}/users/login`, {
      method: 'post',
      headers: getDefaultHttpHeaders(),
      body: JSON.stringify({ email, password })
    })
};

export const projectApi = {
  getAll: async (): Promise<Response> =>
    fetch(`${getUrl()}/projects`, {
      method: 'get',
      headers: getDefaultHttpHeaders()
    }),
  import: async (project: any): Promise<Response> =>
    fetch(`${getUrl()}/projects/import`, {
      method: 'post',
      headers: getDefaultHttpHeaders(),
      body: JSON.stringify(project)
    }),
  delete: async (projectId: number): Promise<Response> =>
    fetch(`${getUrl()}/projects/${projectId}`, {
      method: 'delete',
      headers: getDefaultHttpHeaders()
    })
};

export const learnerApi = {
  calculateSeparatingWord: async (models: Array<any>): Promise<Response> =>
    fetch(`${getUrl()}/projects/0/learner/compare/separatingWord`, {
      method: 'post',
      headers: getDefaultHttpHeaders(),
      body: JSON.stringify(models)
    })
};

export const learnerSetupApi = {
  getAll: async (projectId: number): Promise<Response> =>
    fetch(`${getUrl()}/projects/${projectId}/learner/setups`, {
      method: 'get',
      headers: getDefaultHttpHeaders()
    }),
  execute: async (projectId: number, setupId: number, options: any = null): Promise<Response> =>
    fetch(`${getUrl()}/projects/${projectId}/learner/setups/${setupId}/run`, {
      method: 'post',
      headers: getDefaultHttpHeaders(),
      ...(options != null && { body: JSON.stringify(options) })
    })
};

export const learnerResultApi = {
  get: async (projectId: number, resultId: number): Promise<Response> =>
    fetch(`${getUrl()}/projects/${projectId}/results/${resultId}?embed=steps`, {
      method: 'get',
      headers: getDefaultHttpHeaders()
    })
};

export const testApi = {
  getAll: async (projectId: number): Promise<Response> =>
    fetch(`${getUrl()}/projects/${projectId}/tests/root`, {
      method: 'get',
      headers: getDefaultHttpHeaders()
    }),
  execute: async (projectId: number, config: any): Promise<Response> =>
    fetch(`${getUrl()}/projects/${projectId}/tests/execute`, {
      method: 'post',
      headers: getDefaultHttpHeaders(),
      body: JSON.stringify(config)
    })
};

export const testSetupApi = {
  getAll: async (projectId: number): Promise<Response> =>
    fetch(`${getUrl()}/projects/${projectId}/testConfigs`, {
      method: 'get',
      headers: getDefaultHttpHeaders()
    }),
  execute: async (projectId: number, setupId: number, options: any = null): Promise<Response> =>
    fetch(`${getUrl()}/projects/${projectId}/testConfigs/${setupId}/run`, {
      method: 'post',
      headers: getDefaultHttpHeaders(),
      ...(options != null && { body: JSON.stringify(options) })
    })
};

export const testReportApi = {
  get: async (projectId: number, testReportId: number, format: string | null = null): Promise<Response> => {
    const params = format ? `?format=${encodeURIComponent(format)}` : '';
    return fetch(`${getUrl()}/projects/${projectId}/tests/reports/${testReportId}${params}`, {
      method: 'get',
      headers: getDefaultHttpHeaders()
    });
  }
};
