/*
 * Copyright 2015 - 2022 TU Dortmund
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

/** Action for doing something with the browser window. */
export class BrowserAction extends Action {

  /** The action to execute on the browser window. */
  public action: string;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WEB_BROWSER, obj);

    this.action = obj.action || 'RESTART';
  }

  toString(): string {
    switch (this.action) {
      case 'RESTART': return 'Restart the browser window';
      case 'REFRESH': return 'Refresh the browser window';
      case 'CREATE_TAB': return 'Create a new browser tab';
      case 'CREATE_WINDOW': return 'Create a new browser window';
      case 'CLOSE_TAB': return 'Close the active browser tab';
      case 'CLOSE_WINDOW': return 'Close the active browser window';
    }
    return 'Invalid browser action';
  }
}
