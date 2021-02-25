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

export class JumpToLabelAction extends Action {
  label: string;
  script: string;
  async: boolean;
  timeout: number;

  constructor(obj: any = {}) {
    super(actionType.GENERAL_JUMP_TO_LABEL, obj);

    this.label = obj.label;
    this.script = obj.script || null;
    this.async = obj.async == null ? false : obj.async;
    this.timeout = obj.timeout == null ? 10 : obj.timeout;
  }

  toString(): string {
    return `Jump to label "${this.label}"`;
  }
}
