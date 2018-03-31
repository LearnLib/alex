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

import flatten from 'lodash/flatten';
import remove from 'lodash/remove';
import {events} from '../../../constants';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {DateUtils} from '../../../utils/date-utils';

/**
 * The controller that handles CRUD operations on symbols and symbol groups.
 */
class SymbolsViewComponent {

    /**
     * Constructor.
     *
     * @param $scope
     * @param {SessionService} SessionService
     * @param {SymbolResource} SymbolResource
     * @param {SymbolGroupResource} SymbolGroupResource
     * @param {ToastService} ToastService
     * @param {DownloadService} DownloadService
     * @param {EventBus} EventBus
     * @param {PromptService} PromptService
     */
    // @ngInject
    constructor($scope, SessionService, SymbolResource, SymbolGroupResource, ToastService, DownloadService,
                EventBus, PromptService) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.DownloadService = DownloadService;
        this.PromptService = PromptService;

        /**
         * The project that is saved in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The model for selected symbols.
         * @type {AlphabetSymbol[]}
         */
        this.selectedSymbols = [];

        /**
         * The symbol groups that belong to the project.
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        // fetch all symbol groups and include all symbols
        SymbolGroupResource.getAll(this.project.id, true)
            .then(groups => {
                this.groups = groups;
            })
            .catch(err => console.log(err));

        // listen on group update event
        EventBus.on(events.GROUP_UPDATED, (evt, data) => {
            this.updateGroup(data.group);
        }, $scope);

        // listen on group delete event
        EventBus.on(events.GROUP_DELETED, (evt, data) => {
            this.deleteGroup(data.group);
        }, $scope);

        // listen on symbol update event
        EventBus.on(events.SYMBOL_UPDATED, (evt, data) => {
            this.updateSymbol(data.symbol);
        }, $scope);

        // listen on symbol move event
        EventBus.on(events.SYMBOLS_MOVED, (evt, data) => {
            this.moveSymbolsToGroup(data.symbols, data.group);
        }, $scope);
    }

    /**
     * Finds the symbol group object from a given symbol. Returns undefined if no symbol group was found.
     *
     * @param symbol - The symbol whose group object should be found.
     * @returns {SymbolGroup|undefined} - The found symbol group or undefined.
     */
    findGroupFromSymbol(symbol) {
        return this.groups.find(g => g.id === symbol.group);
    }

    /**
     * Extracts all symbols from all symbol groups and merges them into a single array.
     *
     * @returns {AlphabetSymbol[]}
     */
    getAllSymbols() {
        return flatten(this.groups.map(g => g.symbols));
    }

    /**
     * Adds a single new symbol to the scope by finding its corresponding group and adding it there.
     *
     * @param {AlphabetSymbol} symbol - The symbol that should be added.
     */
    addSymbol(symbol) {
        this.findGroupFromSymbol(symbol).symbols.push(symbol);
    }

    /**
     * Adds multiple new symbols to the scope.
     *
     * @param {AlphabetSymbol[]} symbols
     */
    addSymbols(symbols) {
        symbols.forEach(s => this.addSymbol(s));
    }

    /**
     * Removes a list of symbols from the scope by finding the group of each symbol and removing it from
     * it.
     *
     * @param {AlphabetSymbol[]} symbols - The symbols that should be removed.
     */
    removeSymbols(symbols) {
        symbols.forEach(symbol => {
            const group = this.findGroupFromSymbol(symbol);
            remove(group.symbols, {id: symbol.id});
        });
    }

    /**
     * Updates an existing symbol.
     *
     * @param {AlphabetSymbol} updatedSymbol - The updated symbol object.
     */
    updateSymbol(updatedSymbol) {
        this.updateSymbols([updatedSymbol]);
    }

    /**
     * Updates multiple existing symbols.
     *
     * @param {AlphabetSymbol[]} updatedSymbols - The updated symbol objects.
     */
    updateSymbols(updatedSymbols) {
        updatedSymbols.forEach(symbol => {
            const group = this.findGroupFromSymbol(symbol);
            const i = group.symbols.findIndex(s => s.id === symbol.id);
            if (i > -1) {
                group.symbols[i].name = symbol.name;
                group.symbols[i].group = symbol.group;
            }
        });
    }

    /**
     * Moves a list of existing symbols into another group.
     *
     * @param {AlphabetSymbol[]} symbols - The symbols that should be moved.
     * @param {SymbolGroup} group - The group the symbols should be moved into.
     */
    moveSymbolsToGroup(symbols, group) {
        const toGroup = this.groups.find(g => g.id === group.id);

        symbols.forEach(symbol => {
            const g = this.findGroupFromSymbol(symbol);
            const i = g.symbols.findIndex(s => s.id === symbol.id);
            g.symbols.splice(i, 1);
            symbol.group = group.id;
            toGroup.symbols.push(symbol);
        });
    }

    /**
     * Deletes a single symbol from the server and from the scope if the deletion was successful.
     *
     * @param {AlphabetSymbol} symbol - The symbol to be deleted.
     */
    deleteSymbol(symbol) {
        this.SymbolResource.remove(symbol)
            .then(() => {
                this.ToastService.success('Symbol <strong>' + symbol.name + '</strong> deleted');
                this.removeSymbols([symbol]);
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Deleting symbol failed</strong></p>' + response.data.message);
            });
    }

    /**
     * Deletes all symbols that the user selected from the server and the scope, if the deletion was successful.
     */
    deleteSelectedSymbols() {
        this.SymbolResource.removeMany(this.selectedSymbols)
            .then(() => {
                this.ToastService.success('Symbols deleted');
                this.removeSymbols(this.selectedSymbols);
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Deleting symbols failed</strong></p>' + response.data.message);
            });
    }

    /**
     * Updates a symbol group in the scope by changing its name property to the one of the groups that is passed
     * as a parameter.
     *
     * @param {SymbolGroup} updatedGroup - The updated symbol group.
     */
    updateGroup(updatedGroup) {
        const group = this.groups.find(g => g.id === updatedGroup.id);
        group.name = updatedGroup.name;
    }

    /**
     * Removes a symbol group from the scope and also removes its symbols.
     *
     * @param {SymbolGroup} group - The group to delete.
     */
    deleteGroup(group) {
        this.removeSymbols(group.symbols);
        remove(this.groups, {id: group.id});
    }

    /**
     * Deletes all properties that are not needed for downloading symbols which are the id, project, group
     * and hidden properties. They are removed so that they can later be uploaded and created like new symbols.
     */
    exportSelectedSymbols() {
        if (this.selectedSymbols.length > 0) {
            const name = 'symbols-' + DateUtils.YYYYMMDD();
            this.PromptService.prompt('Enter a name for the json file', name)
                .then(filename => {
                    const symbolsToExport = this.selectedSymbols.map(s => s.getExportableSymbol());
                    this.DownloadService.downloadObject(symbolsToExport, filename);
                    this.ToastService.success('Symbols exported');
                });
        } else {
            this.ToastService.info('Select symbols you want to export');
        }
    }

    /**
     * Copy a selected symbol.
     */
    copySelectedSymbol() {
        const symbol = this.selectedSymbols.find(s => s._selected);
        if (symbol) {
            this.copySymbol(symbol);
        } else {
            this.ToastService.info('You have to select a symbol to copy it');
        }
    }

    /**
     * Copy a symbol.
     * @param {AlphabetSymbol} symbol
     */
    copySymbol(symbol) {
        this.PromptService.prompt('Enter a name for the new symbol', symbol.name)
            .then(name => {
                // check if a symbol with the same name exists
                const symbolWithNameExists = this.getAllSymbols().findIndex(s => s.name === name) > -1;
                if (symbolWithNameExists) {
                    this.ToastService.info(`The symbol with the name "${name}" already exists`);
                    return;
                }

                const s = new AlphabetSymbol();
                s.name = name;
                s.actions = [];
                s.group = symbol.group;
                s.project = this.project.id;

                // first create the symbol without actions
                // then update the symbol with actions
                this.SymbolResource.create(this.project.id, s)
                    .then(data => {
                        data.actions = symbol.actions;
                        return this.SymbolResource.update(data)
                            .then(data => {
                                this.addSymbol(data);
                                this.ToastService.success('The symbol has been copied.');
                            });
                    })
                    .catch(err => this.ToastService.danger(`The symbol could not be created. ${err.data.message}`));
            });
    }
}

export const symbolsViewComponent = {
    controller: SymbolsViewComponent,
    controllerAs: 'vm',
    template: require('./symbols-view.component.html')
};
