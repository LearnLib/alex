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
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';

/**
 * Handles the behaviour of the modal to edit an existing symbol and updates the edited symbol on the server.
 */
export class SymbolEditModalComponent {

    /**
     * Constructor.
     *
     * @param symbolResource
     * @param toastService
     * @param eventBus
     */
    // @ngInject
    constructor(symbolResource, toastService, eventBus) {
        this.symbolResource = symbolResource;
        this.toastService = toastService;
        this.eventBus = eventBus;

        /**
         * The symbol to edit.
         * @type {AlphabetSymbol}
         */
        this.symbol = null;

        /**
         * The error message that is displayed when update fails.
         * @type {null|string}
         */
        this.errorMsg = null;
    }

    $onInit() {
        this.symbol = this.resolve.symbol;
    }

    /**
     * Make a request to the API in order to update the symbol. Close the modal on success.
     */
    updateSymbol() {
        this.errorMsg = null;

        // update the symbol and close the modal dialog on success with the updated symbol
        this.symbolResource.update(this.symbol.toJson())
            .then(updatedSymbol => {
                this.toastService.success('Symbol updated');
                this.eventBus.emit(events.SYMBOL_UPDATED, {symbol: updatedSymbol});
                this.close({$value: updatedSymbol});
            })
            .catch(err => {
                this.errorMsg = err.data.message;
            });
    }
}

export const symbolEditModalComponent = {
    template: require('./symbol-edit-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controller: SymbolEditModalComponent,
    controllerAs: 'vm',
};
