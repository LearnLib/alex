/*
 * Copyright 2015 - 2020 TU Dortmund
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
 * Wait an element of the page to change.
 */
export class WaitForNodeAction extends Action {

  /** The CSS selector of an element. */
  public node: any;

  /** For what event should be waited. Can be 'IS' or 'CONTAINS'. */
  public waitCriterion: string;

  /** The time to wait for the change at max. */
  public maxWaitTime: number;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WAIT_FOR_NODE, obj);

    this.waitCriterion = obj.waitCriterion || 'VISIBLE';
    this.node = obj.node || {selector: '', type: 'CSS'};
    this.maxWaitTime = obj.maxWaitTime || 10;
  }

  toString(): string {
    let text = `Wait until the element "${this.node.selector}" `;
    switch (this.waitCriterion) {
      case 'VISIBLE':
        text += `is visible `;
        break;
      case 'INVISIBLE':
        text += `is invisible `;
        break;
      case 'ADDED':
        text += `is added to the DOM `;
        break;
      case 'REMOVED':
        text += `is removed from the DOM `;
        break;
      case 'CLICKABLE':
        text += `is clickable `;
        break;
      default:
        break;
    }
    text += `for a maximum of "${this.maxWaitTime}s"`;
    return text;
  }
}
