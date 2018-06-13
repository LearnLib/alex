/*
 * Copyright 2018 TU Dortmund
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

/** Action to click on an element with a specific visible text. */
export class ClickElementByTextAction extends Action {

    constructor(obj) {
        super(actionType.WEB_CLICK_ELEMENT_BY_TEXT, obj);

        /**
         * The CSS selector of an element.
         * @type {object}
         */
        this.node = obj.node || {selector: 'body', type: 'CSS'};

        /**
         * The visible text of the element.
         * @type {string}
         */
        this.text = obj.text;

        /**
         * The tag of the element.
         * @type {string}
         */
        this.tagName = obj.tagName;
    }

    toString() {
        return `Click on "${this.tagName}" element with text "${this.text}" in element "${this.node.selector}".`;
    }
}
