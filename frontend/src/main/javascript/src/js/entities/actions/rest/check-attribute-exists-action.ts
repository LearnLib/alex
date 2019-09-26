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
 * Checks in a HTTP response body that is formatted in JSON if a specific attribute exists.
 * E.g. object.attribute.anotherAttribute.
 */
export class CheckAttributeExistsRestAction extends Action {

  /** The JSON property. */
  public attribute: string;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.REST_CHECK_ATTRIBUTE_EXISTS, obj);

    this.attribute = obj.attribute || '';
  }

  toString(): string {
    return 'Check if the JSON of a HTTP response has attribute "' + this.attribute + '"';
  }
}
