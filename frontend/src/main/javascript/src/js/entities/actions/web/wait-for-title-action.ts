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

import {actionType} from '../../../constants';
import {Action} from '../action';

/**
 * Wait for the title of the page to have changed.
 */
export class WaitForTitleAction extends Action {

  /** For what event should be waited. Can be 'IS' or 'CONTAINS'. */
  public waitCriterion: string;

  /** The value of the title. */
  public value: string;

  /** The time to wait for the change at max. */
  public maxWaitTime: number;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WAIT_FOR_TITLE, obj);

    this.waitCriterion = obj.waitCriterion || 'IS';
    this.value = obj.value || '';
    this.maxWaitTime = obj.maxWaitTime || 10;
  }

  toString(): string {
    if (this.waitCriterion === 'IS') {
      return `Wait until the title is "${this.value}" for a maximum of "${this.maxWaitTime}s"`;
    } else {
      return `Wait until the title contains "${this.value}" for a maximum of "${this.maxWaitTime}s"`;
    }
  }
}
