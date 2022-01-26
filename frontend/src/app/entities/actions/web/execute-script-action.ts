/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { actionType } from '../../../constants';
import { Action } from '../action';

/**
 * The action to execute a piece of JavaScript in the web browser.
 */
export class ExecuteScriptAction extends Action {

  /** The JavaScript to execute. */
  public script: string;

  /** The name of the variable the return value can be stored into. */
  public name: string;

  /** If the script is executed asynchronous. */
  public async: boolean;

  /** How long to wait until the script times out. */
  public timeout: number;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WEB_EXECUTE_SCRIPT, obj);

    this.script = obj.script || null;
    this.name = obj.name || null;
    this.async = obj.async == null ? false : obj.async;
    this.timeout = obj.timeout == null ? 10 : obj.timeout;
  }

  toString(): string {
    let output = `Execute JavaScript (${this.async ? 'asynchronous' : 'synchronous'}) in the browser`;
    if (this.name && this.name.trim() !== '') {
      output += ` and store the result in variable "${this.name}"`;
    }
    return output;
  }
}
