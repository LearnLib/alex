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
 * Action to compare the value of a counter to another integer value.
 */
export class AssertCounterAction extends Action {

  /** The name of the counter. */
  public name: string;

  /** The value to compare the content with. */
  public value: string;

  /** The operator to compare two integer values. */
  public operator: string;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from
   */
  constructor(obj: any = {}) {
    super(actionType.GENERAL_ASSERT_COUNTER, obj);

    this.name = obj.name || '';
    this.value = obj.value;
    this.operator = obj.operator || 'EQUAL';
  }

  toString(): string {
    let s;

    switch (this.operator) {
      case 'LESS_THAN':
        s = 'less than';
        break;
      case 'LESS_OR_EQUAL':
        s = 'less or equal to';
        break;
      case 'EQUAL':
        s = 'equal to';
        break;
      case 'GREATER_OR_EQUAL':
        s = 'greater or equal to';
        break;
      case 'GREATER_THAN':
        s = 'greater than';
        break;
      default:
        s = 'undefined';
        break;
    }

    return 'Check if counter "' + this.name + '" is ' + s + ' ' + this.value;
  }
}
