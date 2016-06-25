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

// the instance of the errorService
let instance = null;

/**
 * Used to store an error message and can redirect to the error page.
 *
 * @param $state - The ui.router $state service
 * @returns {{getErrorMessage: getErrorMessage, setErrorMessage: setErrorMessage}}
 * @constructor
 */
export class ErrorService {

    /**
     * Constructor
     * @param $state - The ui.router $state service
     * @returns {*}
     */
    // @ngInject
    constructor($state) {
        // return the instance if available
        if (instance !== null) return instance;

        this.$state = $state;
        this.errorMessage = null;

        // create an instance of ErrorService
        instance = this;
    }

    /**
     * Gets the error message and removes it from the service
     * @returns {string|null}
     */
    getErrorMessage() {
        const msg = this.errorMessage;
        this.errorMessage = null;
        return msg;
    }

    /**
     * Sets the error message
     * @param {string} message
     */
    setErrorMessage(message) {
        this.errorMessage = message;
        this.$state.go('error');
    }
}