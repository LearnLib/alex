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
 * The directive that is used to handle the modal dialog for editing an action. Must be used as an attribute for the
 * attached element. It attaches a click event to the element that opens the modal dialog. Does NOT update the symbol
 * with the new action.
 *
 * The directive excepts two additional attributes. 'action' has to contain the action object to be edited.
 * 'onUpdated' has to be a function with one parameter where the updated action is passed on success.
 *
 * Can be used like this: '<button action-edit-modal-handle action="...">Click Me!</button>'
 *
 * @param $modal - The modal service
 * @param ActionService - ActionService
 * @returns {{restrict: string, scope: {action: string}, link: link}}
 */
// @ngInject
function actionEditModalHandle($modal, ActionService) {
    return {
        restrict: 'A',
        scope: {
            action: '='
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $modal.open({
                templateUrl: 'views/modals/action-edit-modal.html',
                controller: 'ActionEditModalController',
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {

                        // copy the id because it gets lost otherwise
                        const id = scope.action._id;
                        const action = ActionService.create(scope.action);
                        action._id = id;

                        return {
                            action: action
                        };
                    }
                }
            });
        });
    }
}

export default actionEditModalHandle;