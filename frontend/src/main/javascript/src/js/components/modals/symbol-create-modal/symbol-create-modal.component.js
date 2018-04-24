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

import {AlphabetSymbol} from '../../../entities/alphabet-symbol';

/**
 * The controller for the modal window to create a new symbol.
 */
export class SymbolCreateModalComponent {

    /**
     * Constructor.
     *
     * @param {SymbolResource} SymbolResource
     * @param {ToastService} ToastService
     * @param {SessionService} SessionService
     */
    // @ngInject
    constructor(SymbolResource, ToastService, SessionService) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The model of the symbol that will be created.
         * @type {AlphabetSymbol}
         */
        this.symbol = new AlphabetSymbol();

        /**
         * The list of available symbol groups where the new symbol could be created in.
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        /**
         * An error message that can be displayed in the template.
         * @type {String|null}
         */
        this.errorMessage = null;

        /**
         * The selected symbol group.
         * @type {SymbolGroup}
         */
        this.selectedSymbolGroup = null;
    }

    $onInit() {
        this.groups = this.resolve.modalData.groups;
        this.selectedSymbolGroup = this._getDefaultGroup();
        this.symbol.group = this.selectedSymbolGroup.id;
    }

    _getDefaultGroup() {
        return this.groups.reduce((acc, curr) => curr.id < acc.id ? curr : acc);
    }

    _createSymbol() {
        this.symbol.group = this.selectedSymbolGroup.id;

        return this.SymbolResource.create(this.project.id, this.symbol)
            .then(symbol => {
                this.ToastService.success(`Created symbol "${symbol.name}"`);
                this.resolve.modalData.onCreated({symbol});
                this.symbol = new AlphabetSymbol();
                this.symbol.group = this._getDefaultGroup().id;

                // set the form to its original state
                this.form.$setPristine();
                this.form.$setUntouched();
            });
    }

    /**
     * Creates a new symbol but does not close the modal window.
     *
     * @returns {*}
     */
    createSymbolAndContinue() {
        this.errorMessage = null;
        this._createSymbol()
            .catch(response => this.errorMessage = response.data.message);
    }

    /**
     * Makes a request to the API and create a new symbol. If the name of the group the user entered was not found
     * the symbol will be put in the default group with the id 0. Closes the modal on success.
     */
    createSymbol() {
        this._createSymbol()
            .then(this.dismiss)
            .catch(response => this.errorMessage = response.data.message);
    }

    selectSymbolGroup(group) {
        if (this.selectedSymbolGroup != null && this.selectedSymbolGroup.id === group.id) {
            this.selectedSymbolGroup = this._getDefaultGroup();
        } else {
            this.selectedSymbolGroup = group;
        }
    }

}

export const symbolCreateModalComponent = {
    template: require('./symbol-create-modal.component.html'),
    bindings: {
        dismiss: '&',
        resolve: '='
    },
    controller: SymbolCreateModalComponent,
    controllerAs: 'vm'
};
