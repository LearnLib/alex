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
 * Wait for the value of an elements attribute to be or contain a given value.
 */
export class WaitForNodeAttributeAction extends Action {

  /** The CSS selector of an element. */
  public node: any;

  /** For what event should be waited. Can be 'IS' or 'CONTAINS'. */
  public waitCriterion: string;

  /** The name of the attribute. */
  public attribute: string;

  /** The value of the attribute. */
  public value: string;

  /** The time to wait for the change at max. */
  public maxWaitTime: number;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WAIT_FOR_NODE_ATTRIBUTE, obj);

    this.waitCriterion = obj.waitCriterion || 'IS';
    this.node = obj.node || {selector: '', type: 'CSS'};
    this.attribute = obj.attribute || '';
    this.value = obj.value || '';
    this.maxWaitTime = obj.maxWaitTime || 10;
  }

  toString(): string {
    return `Wait until the attribute "${this.attribute}" of the element "${this.node.selector}" ${this.waitCriterion === 'IS' ? 'is' : 'contains' } "${this.value}" for a maximum of "${this.maxWaitTime}s"`;
  }
}
