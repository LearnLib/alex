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

import _ from "lodash";

/**
 * Lists all deleted symbols, what means the symbols where the property 'visible' == 'hidden'. Handles the recover
 * of these symbols. By default, recovered symbols will be moved in the default group with the id 0.
 */
class SymbolsTrashView {

    /**
     * Constructor.
     *
     * @param {SessionService} SessionService
     * @param {SymbolResource} SymbolResource
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(SessionService, SymbolResource, ToastService) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The list of deleted symbols.
         * @type {AlphabetSymbol[]}
         */
        this.symbols = [];

        /**
         * The list of selected symbols.
         * @type {AlphabetSymbol[]}
         */
        this.selectedSymbols = [];

        // fetch all deleted symbols and save them in scope
        this.SymbolResource.getAll(this.project.id, true)
            .then(symbols => {
                this.symbols = symbols;
            })
            .catch(err => console.log(err));
    }

    /**
     * Recovers a deleted symbol by calling the API and removes the recovered symbol from the symbol list on success.
     *
     * @param {AlphabetSymbol} symbol - The symbol that should be recovered from the trash.
     */
    recoverSymbol(symbol) {
        this.SymbolResource.recover(symbol)
            .then(() => {
                this.ToastService.success('Symbol ' + symbol.name + ' recovered');
                _.remove(this.symbols, {id: symbol.id});
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Error recovering symbol ' + symbol.name + '!</strong></p>' + response.data.message);
            });
    }

    /**
     * Recovers all symbols that were selected and calls $scope.recoverSymbol for each one.
     */
    recoverSelectedSymbols() {
        if (this.selectedSymbols.length > 0) {
            this.SymbolResource.recoverMany(this.selectedSymbols)
                .then(() => {
                    this.ToastService.success('Symbols recovered');
                    this.selectedSymbols.forEach(symbol => {
                        _.remove(this.symbols, {id: symbol.id});
                    });
                    this.selectedSymbols = [];
                })
                .catch(response => {
                    this.ToastService.danger('<p><strong>Error recovering symbols!</strong></p>' + response.data.message);
                });
        }
    }
}

export const symbolsTrashView = {
    controller: SymbolsTrashView,
    controllerAs: 'vm',
    templateUrl: 'html/components/views/symbols-trash.html'
};