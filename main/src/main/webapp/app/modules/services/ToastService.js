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

/** A service that is used as a wrapper around the ngToast module. */
// @ngInject
class ToastService {

    /**
     * Constructor
     * @param ngToast - The ngToast service
     */
    constructor(ngToast) {
        this.ngToast = ngToast;
    }

    /**
     * Creates a toast message.
     * @param {string} type - a bootstrap alert class type: 'success', 'error', 'info' etc.
     * @param {string} message - The message to display
     */
    createToast(type, message) {
        this.ngToast.create({
            className: type,
            content: message,
            dismissButton: true
        });
    }

    /**
     * Create a success toast message
     * @param {String} message - The message to display
     */
    success(message) {
        this.createToast('success', message);
    }

    /**
     * Create an error / danger toast message
     * @param {String} message - The message display
     */
    danger(message) {
        this.createToast('danger', message);
    }

    /**
     * Create an info toast message
     * @param {String} message - The message to display
     */
    info(message) {
        this.createToast('info', message);
    }
}

export default ToastService;