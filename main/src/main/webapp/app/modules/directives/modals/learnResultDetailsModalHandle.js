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

/**
 * The controller that is used to display the details of a learn result in a modal dialog. The data that is passed
 * to this controller should be an object with a property 'result' which contains a learn result object. If none is
 * given, nothing will be displayed.
 *
 * @constructor
 */
// @ngInject
class LearnResultDetailsModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     */
    constructor($modalInstance, modalData) {
        this.$modalInstance = $modalInstance;

        /**
         * The result to display information from
         * @type {LearnResult[]}
         */
        this.result = modalData.result;

        /**
         * The index of the current step
         * @type {number}
         */
        this.current = modalData.current;

        /**
         * The data of the tabs that are displayed
         * @type {*[]}
         */
        this.tabs = [
            {heading: 'Current', result: this.result.steps[this.current]},
            {heading: 'Cumulated', result: this.result}
        ];
    }

    /** Close the modal window  */
    ok() {
        this.$modalInstance.dismiss();
    }
}


/**
 * The directive that handles the modal dialog for displaying details about a learn result. Can only be used as
 * an attribute and expects a second attribute 'result' which should be the LearnResult whose details should be
 * shown. Attaches a click event on the element that opens the modal.
 *
 * Use it like this: '<button learn-result-details-modal-handle result="...">Click me!</button>'
 *
 * @param $modal - The modal service
 * @returns {{restrict: string, scope: {result: string}, link: link}}
 */
// @ngInject
function learnResultDetailsModalHandle($modal) {
    return {
        restrict: 'A',
        scope: {
            result: '=',
            current: '='
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/learn-result-details-modal.html',
                controller: LearnResultDetailsModalController,
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {
                        return {
                            result: scope.result,
                            current: scope.current
                        };
                    }
                }
            });
        });
    }
}

export default learnResultDetailsModalHandle;