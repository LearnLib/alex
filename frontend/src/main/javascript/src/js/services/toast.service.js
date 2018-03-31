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

/**
 * A service that is used as a wrapper around the toastr module.
 */
export class ToastService {

    /**
     * Constructor.
     *
     * @param toastr - The toastr service.
     */
    // @ngInject
    constructor(toastr) {
        this.toastr = toastr;
    }

    /**
     * Create a success toast message.
     *
     * @param {String} message - The message to display.
     */
    success(message) {
        this.toastr.clear();
        this.toastr.success(message);
    }

    /**
     * Create an error / danger toast message.
     *
     * @param {String} message - The message display.
     */
    danger(message) {
        this.toastr.clear();
        this.toastr.error(message);
    }

    /**
     * Create an info toast message.
     *
     * @param {String} message - The message to display.
     */
    info(message) {
        this.toastr.clear();
        this.toastr.info(message);
    }
}
