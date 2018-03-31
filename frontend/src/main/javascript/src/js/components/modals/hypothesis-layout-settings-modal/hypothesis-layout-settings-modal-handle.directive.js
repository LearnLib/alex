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
 * The directive that handles the opening of the modal dialog for layout setting of a hypothesis. Has to be used
 * as attribute. It attaches a click event to its element that opens the modal dialog.
 *
 * The corresponding controller should inject 'modalData' {Object}. It holds a property 'layoutSettings' which
 * contains the layoutSettings model.
 *
 * Attribute 'layoutSettings' {Object} should be the model that is passed to the hypothesis directive.
 *
 * Use: '<button hypothesis-layout-settings-modal-handle layout-settings="...">Click Me!</button>'.
 *
 * @param $uibModal - The ui.boostrap $modal service.
 * @returns {{restrict: string, scope: {layoutSettings: string}, link: Function}}
 */
// @ngInject
export function hypothesisLayoutSettingsModalHandleDirective($uibModal) {
    return {
        restrict: 'A',
        scope: {
            layoutSettings: '='
        },
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'hypothesisLayoutSettingsModal',
                    resolve: {
                        modalData: function () {
                            return {
                                layoutSettings: angular.copy(scope.layoutSettings)
                            };
                        }
                    }
                });
            });
        }
    };
}
