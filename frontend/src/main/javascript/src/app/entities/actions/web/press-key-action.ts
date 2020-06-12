/*
 * Copyright 2015 - 2020 TU Dortmund
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
 * Action to press a key on the keyboard.
 */
export class PressKeyAction extends Action {

  /** The CSS selector of an element. */
  public node: any;

  /** The unicode of the key to press. */
  public key: string;


  /**
   * Constructor.
   *
   * @param obj The object to create the action from.
   */
  constructor(obj: any = {}) {
    super(actionType.WEB_PRESS_KEY, obj);

    this.node = obj.node || {selector: null, type: 'CSS'};
    this.key = obj.key || '';
  }

  toString(): string {
    if (this.node.selector == null || this.node.selector.trim() === '') {
      return `Press a key`;
    } else {
      return `Press a key on "${this.node.selector}"`;
    }
  }
}
