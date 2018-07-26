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
import {Selectable} from '../../../utils/selectable';

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
         * @type {Selectable}
         */
        this.selectedSymbols = new Selectable(this.symbols, 'id');

        // fetch all deleted symbols and save them in scope
        this.SymbolResource.getAll(this.project.id, true)
            .then(symbols => {
                this.symbols = symbols;
                this.selectedSymbols = new Selectable(this.symbols, 'id');
            })
            .catch(err => this.ToastService.danger(`Could not get symbols. ${err.data.message}`));

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
                this.selectedSymbols.unselect(symbol);
                remove(this.symbols, {id: symbol.id});
            })
            .catch(err => {
                this.ToastService.danger('<p><strong>Error recovering symbol ' + symbol.name + '!</strong></p>' + err.data.message);
            });
    }

    /**
     * Recovers all symbols that were selected and calls $scope.recoverSymbol for each one.
     */
    recoverSelectedSymbols() {
        const selectedSymbols = this.selectedSymbols.getSelected();
        if (selectedSymbols.length === 0) {
            this.ToastService.info('You have to select at least one symbol.');
            return;
        }

        this.SymbolResource.recoverMany(selectedSymbols)
            .then(() => {
                this.ToastService.success('Symbols recovered');
                selectedSymbols.forEach(symbol => remove(this.symbols, {id: symbol.id}));
                this.selectedSymbols.unselectAll();
            })
            .catch(err => {
                this.ToastService.danger('<p><strong>Error recovering symbols!</strong></p>' + err.data.message);
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
                symbol: () => new AlphabetSymbol(JSON.parse(JSON.stringify(symbol))),
            }
        });
    }

    deleteSymbol(symbol) {
        this.SymbolResource.delete(symbol)
            .then(() => {
                this.ToastService.success('The symbol has been deleted permanently.');
                this.selectedSymbols.unselect(symbol);
                remove(this.symbols, {id: symbol.id});
            })
            .catch(err => this.ToastService.danger(`The symbol could be deleted permanently. ${err.data.message}`));
    }
}

export const symbolsArchiveViewComponent = {
    controller: SymbolsArchiveViewComponent,
    controllerAs: 'vm',
    template: require('./symbols-archive-view.component.html')
};
