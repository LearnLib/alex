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
 * The directive that handles the modal window for the creation of a new symbol. It attaches an click event to the
 * attached element that opens the modal dialog.
 *
 * Use it as an Attribute like 'symbol-create-modal-handle' and add an attribute 'project-id' with the id of the
 * project and an attribute 'on-created' which expects a callback function from the directives parent controller.
 * The callback function should have one parameter that will be the newly created symbol.
 *
 * @param $uibModal - The $modal service.
 * @returns {{restrict: string, scope: {}, link: Function}}
 */
// @ngInject
export function symbolCreateModalHandleDirective($uibModal) {
    return {
        restrict: 'A',
        scope: {
            groups: '=',
            onCreated: '&'
        },
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'symbolCreateModal',
                    resolve: {
                        modalData: () => ({
                            groups: scope.groups,
                            onCreated: scope.onCreated
                        })
                    }
                });
            });
        }
    };
}
