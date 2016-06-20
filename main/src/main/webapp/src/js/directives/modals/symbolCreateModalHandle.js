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

import {events} from '../../constants';
import {AlphabetSymbol} from '../../entities/AlphabetSymbol';

/** The controller for the modal window to create a new symbol */
export class SymbolCreateModalController {

    /**
     * Constructor
     * @param $uibModalInstance
     * @param SymbolResource
     * @param SymbolGroupResource
     * @param ToastService
     * @param SessionService
     * @param EventBus
     */
    // @ngInject
    constructor($uibModalInstance, SymbolResource, SymbolGroupResource, ToastService, SessionService, EventBus) {
        this.$uibModalInstance = $uibModalInstance;
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The model of the symbol that will be created
         * @type {AlphabetSymbol}
         */
        this.symbol = new AlphabetSymbol();

        /**
         * The list of available symbol groups where the new symbol could be created in
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        /**
         * The symbol group that is selected
         * @type {null|SymbolGroup}
         */
        this.selectedGroup = null;

        /**
         * An error message that can be displayed in the template
         * @type {String|null}
         */
        this.error = null;

        // fetch all symbol groups so that they can be selected in the template
        SymbolGroupResource.getAll(this.project.id).then(groups => {
            this.groups = groups;
        });
    }

    /**
     * Creates a new symbol but does not close the modal windown
     * @returns {*}
     */
    createSymbolAndContinue() {
        this.error = null;

        const group = this.groups.find(g => g.name === this.selectedGroup);

        // attach the new symbol to the default group in case none is specified
        this.symbol.group = group ? group.id : 0;

        return this.SymbolResource.create(this.project.id, this.symbol)
            .then(symbol => {
                this.ToastService.success(`Created symbol "${symbol.name}"`);
                this.EventBus.emit(events.SYMBOL_CREATED, {symbol: symbol});
                this.symbol = new AlphabetSymbol();

                // set the form to its original state
                this.form.$setPristine();
                this.form.$setUntouched();
            })
            .catch(response => {
                this.error = response.data.message;
            });
    }

    /**
     * Makes a request to the API and create a new symbol. If the name of the group the user entered was not found
     * the symbol will be put in the default group with the id 0. Closes the modal on success.
     */
    createSymbol() {
        this.createSymbolAndContinue().then(() => {
            this.$uibModalInstance.dismiss();
        });
    }

    /**
     * Closes the modal dialog
     */
    close() {
        this.$uibModalInstance.dismiss();
    }
}


/**
 * The directive that handles the modal window for the creation of a new symbol. It attaches an click event to the
 * attached element that opens the modal dialog.
 *
 * Use it as an Attribute like 'symbol-create-modal-handle' and add an attribute 'project-id' with the id of the
 * project and an attribute 'on-created' which expects a callback function from the directives parent controller.
 * The callback function should have one parameter that will be the newly created symbol.
 *
 * @param $uibModal - The $modal service
 * @returns {{restrict: string, scope: {}, link: link}}
 */
// @ngInject
export function symbolCreateModalHandle($uibModal) {
    return {
        restrict: 'A',
        scope: {},
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $uibModal.open({
                templateUrl: 'html/modals/symbol-create-modal.html',
                controller: SymbolCreateModalController,
                controllerAs: 'vm'
            });
        });
    }
}