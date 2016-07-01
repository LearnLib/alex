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

/** The controller of the error page */
class ErrorView {

    /**
     * Constructor
     * @param $state
     * @param ErrorService
     */
    // @ngInject
    constructor($state, ErrorService) {

        /**
         * The error message
         * @type{string|null}
         */
        this.errorMessage = null;

        const message = ErrorService.getErrorMessage();
        if (message !== null) {
            this.errorMessage = message;
        } else {
            $state.go('home');
        }
    }
}

export const errorView = {
    controller: ErrorView,
    controllerAs: 'vm',
    template: `
        <div class="alx-container">
            <div class="text-center alert-container">
                <div class="alert alert-danger">
                    <i class="fa fa-5x fa-warning"></i>
                    <h3>Something went wrong!</h3>
                    <p ng-bind="::vm.errorMessage"></p>
                </div>
            </div>
        </div>
    `
};