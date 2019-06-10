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

import { Action } from '../action';
import { actionType } from '../../../constants';
import { WebElementLocator } from '../../web-element-locator';

export class DragAndDropAction extends Action {
  sourceNode: WebElementLocator;
  targetNode: WebElementLocator;

  constructor(obj: any = {}) {
    super(actionType.WEB_DRAG_AND_DROP);
    this.sourceNode = obj.sourceNode ? WebElementLocator.fromData(obj.sourceNode) : new WebElementLocator();
    this.targetNode = obj.targetNode ? WebElementLocator.fromData(obj.targetNode) : new WebElementLocator();
  }

  toString(): string {
    return `Drag element "${this.sourceNode.toString()}" to element "${this.targetNode.toString()}"`;
  }
}