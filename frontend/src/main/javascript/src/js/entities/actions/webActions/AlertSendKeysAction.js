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
 * Sends a text to a window.prompt alert.
 */
export class AlertSendKeysAction extends Action {

    /**
     * Constructor.
     * @param obj {object}
     */
    constructor(obj) {
        super(actionType.WEB_ALERT_SEND_KEYS, obj);

        /**
         * The text to send to the alert.
         * @type {string}
         */
        this.text = obj.text || '';
    }

    toString() {
        return `Send text "${this.text}" of the current alert.`;
    }
}