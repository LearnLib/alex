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

import {SymbolGroupUtils} from '../../../utils/symbol-group-utils';

/**
 * The component for the symbols import modal window.
 */
export class SymbolsImportModalComponent {

    /**
     * Constructor.
     *
     * @param {SymbolResource} SymbolResource
     * @param {SessionService} SessionService
     * @param {ToastService} ToastService
     * @param {SymbolGroupResource} SymbolGroupResource
     */
    // @ngInject
    constructor(SymbolResource, SessionService, ToastService, SymbolGroupResource) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.SymbolGroupResource = SymbolGroupResource;

        /**
         * The error message.
         * @type {String}
         */
        this.errorMessage = null;

        /**
         * The current project.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The groups in the project.
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        /**
         * The selected group where the symbols are imported to.
         * @type {SymbolGroup}
         */
        this.selectedGroup = null;

        this.importData = null;
    }

    $onInit() {
        this.groups = this.resolve.groups;
    }

    /**
     * Load the symbols from a JSON file.
     *
     * @param {string} data - The serialized symbols.
     */
    fileLoaded(data) {
        const importData = JSON.parse(data);
        if (importData.type == null || ['symbolGroups', 'symbols'].indexOf(importData.type) === -1) {
            this.errorMessage = 'The file does not seem to contain symbols.';
        } else {
            this.importData = importData;
        }
    }

    /**
     * Import the symbols and close the modal window on success.
     */
    importSymbols() {
        this.errorMessage = null;

        if (this.importData.type === 'symbols') {
            const defaultGroup = SymbolGroupUtils.findDefaultGroup(this.groups);
            this.importData.symbols.forEach(symbol => {
                symbol.group = this.selectedGroup == null ? defaultGroup.id : this.selectedGroup.id;
            });

            this.SymbolResource.createMany(this.project.id, this.importData.symbols)
                .then(createdSymbols => {
                    this.ToastService.success('The symbols have been imported');
                    this.close({$value: {type: 'symbols', symbols: createdSymbols}});
                })
                .catch(err => {
                    this.errorMessage = `The symbols could not be imported. ${err.data.message}`;
                });
        } else {
            this.SymbolGroupResource.createMany(this.project.id, this.importData.symbolGroups)
                .then(createdGroups => {
                    this.ToastService.success('The symbols have been imported');
                    this.close({$value: {type: 'symbolGroups', groups: createdGroups}});
                })
                .catch(err => {
                    this.errorMessage = `The symbols could not be imported. ${err.data.message}`;
                });
        }
    }

    selectGroup(group) {
        this.selectedGroup = group === this.selectedGroup ? null : group;
    }
}

export const symbolsImportModalComponent = {
    template: require('./symbols-import-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controller: SymbolsImportModalComponent,
    controllerAs: 'vm'
};
