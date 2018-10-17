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
     * @param projectService
     * @param symbolResource
     * @param toastService
     * @param $uibModal
     */
    // @ngInject
    constructor(projectService, symbolResource, toastService, $uibModal) {
        this.symbolResource = symbolResource;
        this.toastService = toastService;
        this.$uibModal = $uibModal;
        this.projectService = projectService;

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
        this.symbolResource.getAll(this.project.id, true)
            .then(symbols => {
                this.symbols = symbols;
                this.selectedSymbols = new Selectable(this.symbols, 'id');
            })
            .catch(err => this.toastService.danger(`Could not get symbols. ${err.data.message}`));
    }

    /**
     * Recovers a deleted symbol by calling the API and removes the recovered symbol from the symbol list on success.
     *
     * @param {AlphabetSymbol} symbol - The symbol that should be recovered from the trash.
     */
    recoverSymbol(symbol) {
        this.symbolResource.recover(symbol)
            .then(() => {
                this.toastService.success('Symbol ' + symbol.name + ' recovered');
                this.selectedSymbols.unselect(symbol);
                remove(this.symbols, {id: symbol.id});
            })
            .catch(err => {
                this.toastService.danger('<p><strong>Error recovering symbol ' + symbol.name + '!</strong></p>' + err.data.message);
            });
    }

    /**
     * Recovers all symbols that were selected and calls $scope.recoverSymbol for each one.
     */
    recoverSelectedSymbols() {
        const selectedSymbols = this.selectedSymbols.getSelected();
        if (selectedSymbols.length === 0) {
            this.toastService.info('You have to select at least one symbol.');
            return;
        }

        this.symbolResource.recoverMany(selectedSymbols)
            .then(() => {
                this.toastService.success('Symbols recovered');
                selectedSymbols.forEach(symbol => remove(this.symbols, {id: symbol.id}));
                this.selectedSymbols.unselectAll();
            })
            .catch(err => {
                this.toastService.danger('<p><strong>Error recovering symbols!</strong></p>' + err.data.message);
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
        }).result.then(updatedSymbol => {
            const i = this.symbols.findIndex(s => s.id === updatedSymbol.id);
            this.symbols[i].name = updatedSymbol.name;
        });
    }

    deleteSymbol(symbol) {
        this.symbolResource.delete(symbol)
            .then(() => {
                this.toastService.success('The symbol has been deleted permanently.');
                this.selectedSymbols.unselect(symbol);
                remove(this.symbols, {id: symbol.id});
            })
            .catch(err => this.toastService.danger(`The symbol could be deleted permanently. ${err.data.message}`));
    }

    get project() {
        return this.projectService.store.currentProject;
    }
}

export const symbolsArchiveViewComponent = {
    controller: SymbolsArchiveViewComponent,
    controllerAs: 'vm',
    template: require('./symbols-archive-view.component.html')
};
