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
 * Searches for a string value in the body of an HTTP response.
 */
export class CheckHTTPBodyTextRestAction extends Action {

  /** The string that is searched for. */
  public value: string;

  /** Whether the value is interpreted as regular expression. */
  public regexp: boolean;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.REST_CHECK_FOR_TEXT, obj);

    this.value = obj.value || '';
    this.regexp = obj.regexp || false;
  }

  toString(): string {
    if (this.regexp) {
      return 'Search in the response with regexp "' + this.value + '"';
    } else {
      return 'Search in the response body for "' + this.value + '"';
    }
  }
}
