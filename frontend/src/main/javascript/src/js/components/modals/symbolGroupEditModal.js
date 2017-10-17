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

import {SymbolGroup} from "../../entities/SymbolGroup";
import {events} from "../../constants";

/**
 * The controller that handles the modal dialog for deleting and updating a symbol group. The modal data that is
 * passed must have an property 'group' whose value should be an instance of SymbolGroup.
 */
export class SymbolGroupEditModalComponent {

    /**
     * Constructor.
     *
     * @param {SymbolGroupResource} SymbolGroupResource
     * @param {ToastService} ToastService
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor(SymbolGroupResource, ToastService, EventBus) {
        this.SymbolGroupResource = SymbolGroupResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The symbol group that should be edited.
         * @type {SymbolGroup}
         */
        this.group = null;

        /**
         * An error message that can be displayed in the template.
         * @type {null|String}
         */
        this.errorMsg = null;
    }

    $onInit() {
        this.group = this.resolve.modalData.group;
    }

    /**
     * Updates the symbol group under edit and closes the modal dialog on success.
     */
    updateGroup() {
        this.errorMsg = null;

        this.SymbolGroupResource.update(this.group)
            .then(updatedGroup => {
                this.ToastService.success('Group updated');
                this.EventBus.emit(events.GROUP_UPDATED, {
                    group: updatedGroup
                });
                this.dismiss();
            })
            .catch(response => {
                this.errorMsg = response.data.message;
            });
    }

    /**
     * Deletes the symbol group under edit and closes the modal dialog on success.
     */
    deleteGroup() {
        this.errorMsg = null;

        this.SymbolGroupResource.remove(this.group)
            .then(() => {
                this.ToastService.success(`Group <strong>${this.group.name}</strong> deleted`);
                this.EventBus.emit(events.GROUP_DELETED, {
                    group: this.group
                });
                this.dismiss();
            })
            .catch(response => {
                this.errorMsg = response.data.message;
            });
    }
}


export const symbolGroupEditModalComponent = {
    templateUrl: 'html/components/modals/symbol-group-edit-modal.html',
    bindings: {
        dismiss: '&',
        resolve: '='
    },
    controller: SymbolGroupEditModalComponent,
    controllerAs: 'vm'
};


/**
 * The directive that handles the opening of the modal for editing or deleting a symbol group. Can only be used as
 * attribute and attaches a click event to the source element that opens the modal.
 *
 * Attribute 'group' - The model for the symbol group.
 *
 * Use: '<button symbol-group-edit-modal group="..." on-updated="..." on-deleted="...">Click Me!</button>'.
 *
 * @param $uibModal - The ui.bootstrap $modal service.
 * @returns {{scope: {group: string}, link: Function}}
 */
// @ngInject
export function symbolGroupEditModalHandle($uibModal) {
    return {
        restrict: 'A',
        scope: {
            group: '='
        },
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'symbolGroupEditModal',
                    resolve: {
                        modalData: function () {
                            return {group: new SymbolGroup(scope.group)};
                        }
                    }
                });
            });
        }
    };
}