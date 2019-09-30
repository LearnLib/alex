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
export class WaitForTextAction extends Action {

  /** The CSS selector of an element. */
  public node: any;

  /** The time to wait for the change at max. */
  public maxWaitTime: number;

  /** The piece of text to look for. */
  public value: string;

  /** Whether the value is a regular expression. */
  public regexp: boolean;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WAIT_FOR_TEXT, obj);

    this.node = obj.node || {selector: 'body', type: 'CSS'};
    this.value = obj.value || '';
    this.regexp = obj.regexp || false;
    this.maxWaitTime = obj.maxWaitTime || 10;
  }

  toString(): string {
    return `Wait until the text "${this.value}" ${this.regexp ? '(regex)' : ''} is present in element "${this.node.selector}" for a maximum of ${this.maxWaitTime}s.`;
  }
}
