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

export interface Credentials {
  name: string;
  password: string;
}

/**
 * Opens a URL.
 */
export class GoToWebAction extends Action {

  /** The url that is called. */
  public url: string;

  /** The HTTP Basic auth credentials of the request (optional). */
  public credentials: Credentials;

  /** If the URL is absolute and not relative to the projects base URL. */
  public absolute: boolean;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WEB_GO_TO, obj);

    this.url = obj.url || '';
    this.absolute = obj.absolute == null ? false : obj.absolute;
    this.credentials = obj.credentials || {};
  }

  toString(): string {
    return `Open URL "${this.url}"`;
  }
}
