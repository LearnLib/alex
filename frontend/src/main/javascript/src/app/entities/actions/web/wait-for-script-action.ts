/*
 * Copyright 2015 - 2019 TU Dortmund
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
 * Action to wait for a text/pattern to be present in an element.
 */
export class WaitForScriptAction extends Action {

  /** The time to wait for the change at max. */
  public maxWaitTime: number;

  /** The JavaScript to execute. */
  public script: string;

  /** How long to wait until the script times out. */
  public timeout: number;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WEB_WAIT_FOR_SCRIPT, obj);

    this.timeout = obj.timeout == null ? 10 : obj.timeout;
    this.script = obj.script || 'return true';
    this.maxWaitTime = obj.maxWaitTime || 10;
  }

  toString(): string {
    return `Wait for JavaScript for a maximum of ${this.maxWaitTime}s.`;
  }
}
