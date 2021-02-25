/*
 * Copyright 2015 - 2021 TU Dortmund
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
 * Counts the amount of nodes matching a selector.
 */
export class SetVariableByNodeCountAction extends Action {

  /** The name of the variable. */
  public name: string;

  /** The selector of the node. */
  public node: any;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.GENERAL_SET_VARIABLE_BY_NODE_COUNT, obj);

    this.name = obj.name || '';
    this.node = obj.node || {selector: '', type: 'CSS'};
  }

  toString(): string {
    return `Set variable "${this.name}" to the number of elements with the selector "${this.node.selector}"`;
  }
}
