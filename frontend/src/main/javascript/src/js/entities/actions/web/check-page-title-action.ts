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
 * Searches for a piece of text or a regular expression in the HTML document.
 */
export class CheckPageTitleAction extends Action {

  /** The page title to look for or the regexp to match the title against. */
  public title: string;

  /** If the title should be interpreted as regexp. */
  public regexp: boolean;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WEB_CHECK_PAGE_TITLE, obj);

    this.title = obj.title || '';
    this.regexp = obj.regexp || false;
  }

  toString(): string {
    if (this.regexp) {
      return 'Check if the page title matches "' + this.title + '"';
    } else {
      return 'Check if the page title equals "' + this.title + '"';
    }
  }
}
