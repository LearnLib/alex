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
 * Searches for an element with a specific selector in the HTML document.
 */
export class UploadFileAction extends Action {

  /** The CSS selector of an element. */
  public node: any;

  /** The name of the file to upload. */
  public fileName: string;

  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WEB_UPLOAD_FILE, obj);

    this.node = obj.node || {selector: '', type: 'CSS'};
    this.fileName = obj.fileName || '';
  }

  toString(): string {
    return `Select file "${this.fileName}" to upload into element "${this.node.selector}"`;
  }
}
