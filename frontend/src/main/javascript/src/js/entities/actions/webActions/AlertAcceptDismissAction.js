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

import {actionType} from '../../../constants';
import {Action} from '../Action';

/**
 * Accepts or dismisses a alert window.
 */
export class AlertAcceptDismissAction extends Action {

    /**
     * Constructor.
     * @param obj {object}
     */
    constructor(obj) {
        super(actionType.WEB_ALERT_ACCEPT_DISMISS, obj);

        /**
         * The text to send to the alert.
         * @type {string}
         */
        this.action = obj.action || 'ACCEPT';
    }

    toString() {
        return `${this.action === 'ACCEPT' ? 'Accept' : 'Dismiss'} the alert window.`;
    }
}
