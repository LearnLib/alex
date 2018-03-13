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
 * The controller of the error page.
 */
class ErrorViewComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param {ErrorService} ErrorService
     */
    // @ngInject
    constructor($state, ErrorService) {

        /**
         * The error message.
         * @type{string|null}
         */
        this.errorMessage = null;

        const message = ErrorService.getErrorMessage();
        if (message !== null) {
            this.errorMessage = message;
        } else {
            $state.go('root');
        }
    }
}

export const errorViewComponent = {
    template: require('./error-view.component.html'),
    controller: ErrorViewComponent,
    controllerAs: 'vm'
};
