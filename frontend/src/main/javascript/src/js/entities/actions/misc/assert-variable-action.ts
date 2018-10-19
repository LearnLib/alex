/*
 * Copyright 2018 TU Dortmund
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

import {actionType} from '../../../constants';
import {Action} from '../action';

/**
 * Action to check if the value of a variable equals or matches a specific string value.
 */
export class AssertVariableAction extends Action {

  /** The name of the variable. */
  public name: string;

  /** The value to assert against. */
  public value: string;

  /** If value is a regular expression. */
  public regexp: boolean;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.GENERAL_ASSERT_VARIABLE, obj);

    this.name = obj.name || '';
    this.value = obj.value || '';
    this.regexp = obj.regexp || false;
  }

  /**
   *
   *
   * @returns {string}
   */
  toString(): string {
    if (this.regexp) {
      return 'Assert variable "' + this.name + '" to match "' + this.value + '"';
    } else {
      return 'Assert variable "' + this.name + '" to equal "' + this.value + '"';
    }
  }
}
