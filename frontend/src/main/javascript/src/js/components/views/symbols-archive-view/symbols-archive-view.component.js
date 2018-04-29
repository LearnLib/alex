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

import remove from 'lodash/remove';
import {events} from '../../../constants';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';

/**
 * Lists all deleted symbols, what means the symbols where the property 'visible' == 'hidden'. Handles the recover
 * of these symbols. By default, recovered symbols will be moved in the default group with the id 0.
 */
class SymbolsArchiveViewComponent {

    /**
     * Constructor.
     *
     * @param {SessionService} SessionService
     * @param {SymbolResource} SymbolResource
     * @param {ToastService} ToastService
     * @param {EventBus} EventBus
     * @param $scope
     * @param $uibModal
     */
    // @ngInject
    constructor(SessionService, SymbolResource, ToastService, EventBus, $scope, $uibModal) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;
        this.$uibModal = $uibModal;

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

        this.EventBus.on(events.SYMBOL_UPDATED, (evt, data) => {
            const i = this.symbols.findIndex(s => s.id === data.symbol.id);
            this.symbols[i].name = data.symbol.name;
        }, $scope);
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
                remove(this.symbols, {id: symbol.id});
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Error recovering symbol ' + symbol.name + '!</strong></p>' + response.data.message);
            });
    }

    /**
     * Recovers all symbols that were selected and calls $scope.recoverSymbol for each one.
     */
    recoverSelectedSymbols() {
        if (this.selectedSymbols.length === 0) {
            this.ToastService.info('You have to select at least one symbol.');
        }

        this.SymbolResource.recoverMany(this.selectedSymbols)
            .then(() => {
                this.ToastService.success('Symbols recovered');
                this.selectedSymbols.forEach(symbol => {
                    remove(this.symbols, {id: symbol.id});
                });
                this.selectedSymbols = [];
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Error recovering symbols!</strong></p>' + response.data.message);
            });
    }

    /**
     * Edits the symbol.
     *
     * @param {AlphabetSymbol} symbol The symbol to edit.
     */
    editSymbol(symbol) {
        this.$uibModal.open({
            component: 'symbolEditModal',
            resolve: {
                modalData: () => ({
                    symbol: new AlphabetSymbol(JSON.parse(JSON.stringify(symbol))),
                    updateOnServer: true
                })
            }
        });
    }
}

export const symbolsArchiveViewComponent = {
    controller: SymbolsArchiveViewComponent,
    controllerAs: 'vm',
    template: require('./symbols-archive-view.component.html')
};
