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

/**
 * Searches for an element with a specific selector in the HTML document.
 */
export class UploadFileAction extends Action {

    /**
     * Constructor.
     *
     * @param {object} obj - The object to create the action from.
     */
    constructor(obj) {
        super(actionType.WEB_UPLOAD_FILE, obj);

        /**
         * The selector of the node to search.
         * @type {Object}
         */
        this.node = obj.node || {selector: '', type: 'CSS'};

        /**
         * The name of the file to upload.
         * @type {string}
         */
        this.fileName = obj.fileName || '';
    }

    /**
     * A string representation of the action.
     *
     * @returns {string}
     */
    toString() {
        return `Select file "${this.fileName}" to upload into element "${this.node.selector}"`;
    }
}
