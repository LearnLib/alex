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
 * Sets a variable to a specific value and implicitly initializes it if it has not been created before.
 */
export class SetCounterGeneralAction extends Action {

  /** The name of the counter. */
  public name: string;

  /** The value of the counter. */
  public value: string;

  /** How the value is handled. */
  public valueType: string;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.GENERAL_SET_COUNTER, obj);

    this.name = obj.name || '';
    this.value = obj.value || '0';
    this.valueType = obj.valueType || 'NUMBER';
  }

  toString(): string {
    return 'Set counter "' + this.name + '" to "' + this.value + '"';
  }
}
