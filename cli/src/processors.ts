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

import dateFormat from 'dateformat';
import { existsSync, readFileSync } from 'fs';
import { Webhook, HttpMethod } from './types';
import { randomString } from './utils';

/**
 * Check if the passed url parameter is a valid URL.
 *
 * @param url The URL.
 * @return The URL.
 */
export const processUrl = (url: string): string => {
  if (!url.match(/https?:\/\/.+?/)) {
    throw 'The URL has to start with http:// or https://';
  }

  return url;
};

/**
 * Check if the passed email parameter is a valid email.
 *
 * @param email The email.
 * @return The email.
 */
export const processEmail = (email: string): string => {
  if (!email.includes('@')) {
    throw 'The email does not seem valid.';
  }

  return email;
};

/**
 * Check if the project file exists and if it is not empty.
 *
 * @param file The path to file that contains a serialized project
 * @return The parsed JSON object.
 */
export const processProjectFile = (file: string): Object => {
  if (!existsSync(file)) {
    throw 'The provided project file does not exist.';
  }

  const contents = readFileSync(file, 'utf8');
  if (contents.trim() === '') {
    throw 'The provided project file is empty.';
  }

  try {
    return JSON.parse(contents);
  } catch (e) {
    throw 'Failed to parse file to JSON.';
  }
};

/**
 * Check if the passed arguments for the callback URL are valid and in correct order.
 *
 * @param args [method, url, headers]
 * @return The Callback URL object.
 */
export const processCallbackUrl = (args: Array<string>): Webhook => {
  if (args.length < 2 || args.length > 3) {
    throw 'The callback URL needs to have at least two and at most three arguments.';
  }

  let method = HttpMethod.POST;
  if (!HttpMethod[args[0]]) {
    throw 'Invalid HTTP method provided for callback URL.';
  } else {
    method = HttpMethod[args[0]];
  }

  const url = args[1];
  processUrl(url);

  let headers = {};
  if (args[2] != null) {
    try {
      headers = JSON.parse(args[2]);
    } catch (e) {
      throw 'Failed to parse headers. Must be a JSON object.';
    }
  }

  return {
    url,
    method,
    headers,
    events: [],
    name: `wh-${dateFormat(new Date(), 'isoDateTime')}-${randomString(10)}`,
  };
};

/**
 * Check if the files to serialized models exist and that they are not empty.
 *
 * @param args A list of length 2 with paths to model files.
 * @return A list of length 2 with serialized models.
 */
export const processCompareModelFiles = (args: Array<string>): Array<string> => {
  if (args.length !== 2) {
    throw 'Need to specify exactly two files.';
  }

  if (!existsSync(args[0]) || !existsSync(args[1])) {
    throw 'At least one of the model files does not exist.';
  }

  try {
    const a = readFileSync(args[0], 'utf8');
    const b = readFileSync(args[1], 'utf8');
    JSON.parse(a);
    JSON.parse(b);
    return [a, b];
  } catch (e) {
    throw 'Failed to parse one of the model files to JSON.';
  }
};

/**
 * Check if the specified argument for the project id is a number and non negative.
 *
 * @param arg The ID.
 * @return The ID.
 */
export const processId = (arg: string): number => {
  let id = 0;
  try {
    id = parseInt(arg, 10);
  } catch (e) {
    throw 'The ID has to be a number.';
  }

  if (id < 0) {
    throw 'The ID has to be > 0.';
  }

  return id;
};

/**
 * Check if the specified argument for the timeout is a number and non negative.
 *
 * @param arg The timeout in ms.
 * @return The timeout in ms.
 */
export const processTimeout = (arg: string): number => {
  let timeout = 0;
  try {
    timeout = parseInt(arg, 10);
  } catch (e) {
    throw 'The timeout has to be a number.';
  }

  if (timeout < 0) {
    throw 'The timeout has to be > 0.';
  }

  return timeout;
};
