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

import {events} from '../../../constants';
import {SymbolGroup} from '../../../entities/symbol-group';

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
     * @param {PromptService} PromptService
     */
    // @ngInject
    constructor(SymbolGroupResource, ToastService, EventBus, PromptService) {
        this.SymbolGroupResource = SymbolGroupResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;
        this.PromptService = PromptService;

        /**
         * The symbol group that should be edited.
         * @type {SymbolGroup}
         */
        this.group = null;

        /**
         * An error message that can be displayed in the template.
         * @type {String}
         */
        this.errorMessage = null;
    }

    $onInit() {
        this.group = this.resolve.group;
    }

    /**
     * Updates the symbol group under edit and closes the modal dialog on success.
     */
    updateGroup() {
        this.errorMessage = null;

        this.SymbolGroupResource.update(this.group)
            .then(updatedGroup => {
                this.ToastService.success('Group updated');
                this.EventBus.emit(events.GROUP_UPDATED, {
                    group: updatedGroup
                });
                this.dismiss();
            })
            .catch(err => {
                this.errorMessage = err.data.message;
            });
    }
}

export const symbolGroupEditModalComponent = {
    template: require('./symbol-group-edit-modal.component.html'),
    bindings: {
        dismiss: '&',
        resolve: '='
    },
    controller: SymbolGroupEditModalComponent,
    controllerAs: 'vm'
};
