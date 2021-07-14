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

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface Webhook {
  url: string,
  name: string,
  method: HttpMethod,
  headers: { [key: string]: string; }
  events: Array<string>
}

export interface CommandOptions {
  url: string,
  email: string,
  password: string
}

export interface TestCommandOptions extends CommandOptions {
  setupName: string,
  deleteProject: boolean,
  wait: boolean,
  projectFile?: string,
  projectName?: string,
  out?: string,
  callbackUrl?: Webhook,
}

export interface LearnCommandOptions extends TestCommandOptions {
  ltlOut?: string
}

export interface CompareCommandOptions extends CommandOptions {
  models: Array<string>,
  out?: string
}

export interface PollCommandOptions extends CommandOptions {
  projectName: string,
  timeout: number,
  out?: string,
}

export interface PollTestReportCommandOptions extends PollCommandOptions {
  reportId: number
}

export interface PollLearnerResultCommandOptions extends PollCommandOptions {
  resultId: number,
  ltlOut?: string
}
