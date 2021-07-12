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

import chalk from 'chalk';
import { CommandOptions } from './types';
import { userApi } from './apis';
import { assertStatus } from './utils';

/**
 * The token of an authenticated user.
 */
let jwt: string | null = null;

/**
 * The base URL of the ALEX API.
 */
let url: string = '';

/**
 * Initialize the context for the CLI.
 *
 * @param options The options passed by the user.
 */
export const init = async (options: CommandOptions): Promise<void> => {
  try {
    url = options.url;
    const res = await userApi.login(options.email, options.password);
    await assertStatus(res, 200);
    console.log(chalk.white.dim(`User "${options.email}" logged in.`));
    jwt = (await res.json()).token;
  } catch (e) {
    throw 'Failed to login user.';
  }
};

export const getUrl = (): string => `${url}/rest`;
export const getJwt = (): string | null => jwt;
