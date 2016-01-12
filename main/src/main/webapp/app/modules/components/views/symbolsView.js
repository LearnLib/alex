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

import _ from 'lodash';
import {events} from '../../constants';
import {Symbol} from '../../entities/Symbol';

/**
 * The controller that handles CRUD operations on symbols and symbol groups.
 */
// @ngInject
class SymbolsView {

    /**
     * Constructor
     * @param $scope
     * @param SessionService
     * @param SymbolResource
     * @param SymbolGroupResource
     * @param ToastService
     * @param FileDownloadService
     * @param EventBus
     */
    constructor($scope, SessionService, SymbolResource, SymbolGroupResource, ToastService, FileDownloadService,
                EventBus) {

        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.FileDownloadService = FileDownloadService;

        /**
         * The project that is saved in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The model for selected symbols
         * @type {Symbol[]}
         */
        this.selectedSymbols = [];

        /**
         * The symbol groups that belong to the project
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        // fetch all symbol groups and include all symbols
        SymbolGroupResource.getAll(this.project.id, true).then(groups => {
            this.groups = groups;
        });

        // listen on group create event
        EventBus.on(events.GROUP_CREATED, (evt, data) => {
            this.groups.push(data.group);
        }, $scope);

        // listen on group update event
        EventBus.on(events.GROUP_UPDATED, (evt, data) => {
            this.updateGroup(data.group);
        }, $scope);

        // listen on group delete event
        EventBus.on(events.GROUP_DELETED, (evt, data) => {
            this.deleteGroup(data.group);
        }, $scope);

        // listen on symbol created event
        EventBus.on(events.SYMBOL_CREATED, (evt, data) => {
            this.addSymbol(data.symbol);
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
     * @param symbol - The symbol whose group object should be found
     * @returns {SymbolGroup|undefined} - The found symbol group or undefined
     */
    findGroupFromSymbol(symbol) {
        return this.groups.find(g =>g.id === symbol.group);
    }

    /**
     * Extracts all symbols from all symbol groups and merges them into a single array
     *
     * @returns {Symbol[]}
     */
    getAllSymbols() {
        return _.flatten(this.groups.map(g => g.symbols));
    }

    /**
     * Adds a single new symbol to the scope by finding its corresponding group and adding it there
     *
     * @param {Symbol} symbol - The symbol that should be added
     */
    addSymbol(symbol) {
        this.findGroupFromSymbol(symbol).symbols.push(symbol);
    }

    /**
     * Removes a list of symbols from the scope by finding the group of each symbol and removing it from
     * it
     *
     * @param {Symbol[]} symbols - The symbols that should be removed
     */
    removeSymbols(symbols) {
        symbols.forEach(symbol => {
            const group = this.findGroupFromSymbol(symbol);
            _.remove(group.symbols, {id: symbol.id});
        });
    }

    /**
     * Updates an existing symbol
     *
     * @param {Symbol} updatedSymbol - The updated symbol object
     */
    updateSymbol(updatedSymbol) {
        this.updateSymbols([updatedSymbol]);
    }

    /**
     * Updates multiple existing symbols
     *
     * @param {Symbol[]} updatedSymbols - The updated symbol objects
     */
    updateSymbols(updatedSymbols) {
        updatedSymbols.forEach(symbol => {
            const group = this.findGroupFromSymbol(symbol);
            const i = group.symbols.findIndex(s => s.id === symbol.id);
            if (i > -1) {
                group.symbols[i].name = symbol.name;
                group.symbols[i].abbreviation = symbol.abbreviation;
                group.symbols[i].group = symbol.group;
                group.symbols[i].revision = symbol.revision;
            }
        });
    }

    /**
     * Moves a list of existing symbols into another group.
     *
     * @param {Symbol[]} symbols - The symbols that should be moved
     * @param {SymbolGroup} group - The group the symbols should be moved into
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
     * Deletes a single symbol from the server and from the scope if the deletion was successful
     *
     * @param {Symbol} symbol - The symbol to be deleted
     */
    deleteSymbol(symbol) {
        this.SymbolResource.remove(symbol)
            .success(() => {
                this.ToastService.success('Symbol <strong>' + symbol.name + '</strong> deleted');
                this.removeSymbols([symbol]);
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Deleting symbol failed</strong></p>' + response.data.message);
            });
    }

    /**
     * Deletes all symbols that the user selected from the server and the scope, if the deletion was successful
     */
    deleteSelectedSymbols() {
        this.SymbolResource.removeMany(this.selectedSymbols)
            .success(() => {
                this.ToastService.success('Symbols deleted');
                this.removeSymbols(this.selectedSymbols);
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Deleting symbols failed</strong></p>' + response.data.message);
            });
    }

    /**
     * Updates a symbol group in the scope by changing its name property to the one of the groups that is passed
     * as a parameter
     *
     * @param {SymbolGroup} updatedGroup - The updated symbol group
     */
    updateGroup(updatedGroup) {
        const group = this.groups.find(g => g.id === updatedGroup.id);
        group.name = updatedGroup.name;
    }

    /**
     * Removes a symbol group from the scope and also removes its symbols
     *
     * @param {SymbolGroup} group
     */
    deleteGroup(group) {
        this.removeSymbols(group.symbols);
        _.remove(this.groups, {id: group.id});
    }

    /**
     * Deletes all properties that are not needed for downloading symbols which are the id, revision, project, group
     * and hidden properties. They are removed so that they can later be uploaded and created like new symbols.
     */
    exportSelectedSymbols() {
        if (this.selectedSymbols.length > 0) {

            // create a copy of the symbol list and sort them by id
            // so that ids can be referenced correctly by executeSymbol actions
            const symbols = this.selectedSymbols
                .map(s => new Symbol(s))
                .sort((s1, s2) => s1.id - s2.id);

            // adjust referenced symbol ids from executeSymbol actions
            symbols.forEach(symbol => {
                symbol.actions.forEach(action => {
                    if (action.type === 'executeSymbol') {
                        action.symbolToExecute.revision = 1;
                        symbols.forEach((s, i) => {
                            if (s.id === action.symbolToExecute.id) {
                                action.symbolToExecute.id = i + 1;
                            }
                        });
                    }
                });
            });

            // get a list of exportable symbols
            // and download them
            const symbolsToExport = symbols.map(s => s.getExportableSymbol());
            this.FileDownloadService.downloadJson(symbolsToExport).then(() => {
                this.ToastService.success('Symbols exported');
            });
        } else {
            this.ToastService.info('Select symbols you want to export');
        }
    }
}

export const symbolsView = {
    controller: SymbolsView,
    controllerAs: 'vm',
    templateUrl: 'views/pages/symbols.html'
};