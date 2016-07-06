/*
 * Copyright 2016 TU Dortmund
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

import {Action} from "../Action";
import {actionType} from "../../../constants";

/**
 * Action to move the mouse to an element or a screen position, e.g. in order to make
 * invisible elements visible or to scroll on the page.
 */
export class MoveMouseAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WEB_MOUSE_MOVE, obj);

        /**
         * The CSS selector of an select element
         * @type {*|string}
         */
        this.node = obj.node || null;

        /**
         * The amount in px to move the mouse in x direction from the current position.
         */
        this.offsetX = obj.offsetX || 0;

        /**
         * The amount in px to move the mouse in y direction from the current position.
         */
        this.offsetY = obj.offsetY || 0;
    }

    /**
     * Get the string representation of the action.
     * @returns {string}
     */
    toString() {
        if (this.node === null || this.node.trim() === '') {
            return `Move mouse by ${this.offsetX}px (x), ${this.offsetY}px (y)`;
        } else {
            return `Move mouse to element "${this.node}" with offset: ${this.offsetX}px (x), ${this.offsetY}px (y)`;
        }
    }
}