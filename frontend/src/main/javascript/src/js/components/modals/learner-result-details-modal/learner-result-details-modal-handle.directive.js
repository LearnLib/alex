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
 * The directive that handles the modal dialog for displaying details about a learn result. Can only be used as
 * an attribute and expects a second attribute 'result' which should be the LearnResult whose details should be
 * shown. Attaches a click event on the element that opens the modal.
 *
 * Use it like this: '<button learner-result-details-modal-handle result="...">Click me!</button>'.
 *
 * @param $uibModal - The modal service.
 * @returns {{restrict: string, scope: {result: string}, link: Function}}
 */
// @ngInject
export function learnerResultDetailsModalHandleDirective($uibModal) {
    return {
        restrict: 'A',
        scope: {
            result: '=',
            current: '='
        },
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'learnerResultDetailsModal',
                    resolve: {
                        modalData: () => ({
                            result: scope.result,
                            current: scope.current
                        })
                    }
                });
            });
        }
    };
}
