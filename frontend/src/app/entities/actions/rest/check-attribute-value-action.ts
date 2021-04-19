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
 * Checks if a property of a JSON object in a HTTP response body has a specific value or matches a regular
 * expression.
 */
export class CheckAttributeValueRestAction extends Action {

  /** The JSON property. */
  public attribute: string;

  /** The value that is searched for in the property. */
  public value: string;

  /** Whether the value is a regular expression. */
  public regexp: boolean;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.REST_CHECK_ATTRIBUTE_VALUE, obj);

    this.attribute = obj.attribute || '';
    this.value = obj.value || '';
    this.regexp = obj.regexp || false;
  }

  toString(): string {
    if (this.regexp) {
      return 'Check if JSON attribute "' + this.attribute + '" matches "' + this.value + '"';
    } else {
      return 'Check JSON attribute "' + this.attribute + '" to equal "' + this.value + '"';
    }
  }
}
