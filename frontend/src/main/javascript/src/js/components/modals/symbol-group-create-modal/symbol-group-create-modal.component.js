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

import {SymbolGroup} from '../../../entities/symbol-group';

/**
 * The controller for the modal dialog that handles the creation of a new symbol group.
 */
export class SymbolGroupCreateModalComponent {

    /**
     * Constructor.
     *
     * @param {ProjectService} ProjectService
     * @param {SymbolGroupResource} SymbolGroupResource
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(ProjectService, SymbolGroupResource, ToastService) {
        this.SymbolGroupResource = SymbolGroupResource;
        this.ToastService = ToastService;
        this.ProjectService = ProjectService;

        /**
         * The new symbol group.
         * @type {SymbolGroup}
         */
        this.group = new SymbolGroup();

        /**
         * All available groups of the project.
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        /**
         * The selected symbol group.
         * @type {SymbolGroup}
         */
        this.selectedSymbolGroup = null;

        /**
         * An error message that can be displayed in the modal template.
         * @type {String|null}
         */
        this.errorMsg = null;

        this.SymbolGroupResource.getAll(this.project.id, true)
            .then(groups => this.groups = groups);
    }

    /**
     * Creates a new symbol group and closes the modal on success and passes the newly created symbol group.
     */
    createGroup() {
        this.errorMsg = null;
        this.group.parent = this.selectedSymbolGroup == null ? null : this.selectedSymbolGroup.id;

        this.SymbolGroupResource.create(this.project.id, this.group)
            .then(createdGroup => {
                this.ToastService.success('Symbol group <strong>' + createdGroup.name + '</strong> created');
                this.close({$value: createdGroup});
                this.dismiss();
            })
            .catch(response => {
                this.errorMsg = response.data.message;
            });
    }

    selectSymbolGroup(group) {
        if (this.selectedSymbolGroup != null && this.selectedSymbolGroup.id === group.id) {
            this.selectedSymbolGroup = null;
        } else {
            this.selectedSymbolGroup = group;
        }
    }

    get project() {
        return this.ProjectService.store.currentProject;
    }
}

export const symbolGroupCreateModalComponent = {
    template: require('./symbol-group-create-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&'
    },
    controller: SymbolGroupCreateModalComponent,
    controllerAs: 'vm'
};
