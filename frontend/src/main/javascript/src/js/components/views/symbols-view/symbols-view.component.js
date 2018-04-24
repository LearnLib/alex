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
import {DateUtils} from '../../../utils/date-utils';
import {SymbolGroupUtils} from '../../../utils/symbol-group-utils';

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
     * @param $state
     */
    // @ngInject
    constructor($scope, SessionService, SymbolResource, SymbolGroupResource, ToastService, DownloadService,
                EventBus, PromptService, $state) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.DownloadService = DownloadService;
        this.PromptService = PromptService;
        this.$state = $state;

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
     * Extracts all symbols from all symbol groups and merges them into a single array.
     *
     * @returns {AlphabetSymbol[]}
     */
    getAllSymbols() {
        return SymbolGroupUtils.getSymbols(this.groups);
    }

    /**
     * Adds a single new symbol to the scope by finding its corresponding group and adding it there.
     *
     * @param {AlphabetSymbol} symbol - The symbol that should be added.
     */
    addSymbol(symbol) {
        const group = SymbolGroupUtils.findGroupById(this.groups, symbol.group);
        group.symbols.push(symbol);
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
            const group = SymbolGroupUtils.findGroupById(this.groups, symbol.group);
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
            const group = SymbolGroupUtils.findGroupById(this.groups, symbol.group);
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
        const toGroup = SymbolGroupUtils.findGroupById(this.groups, group.id);

        symbols.forEach(symbol => {
            const g = SymbolGroupUtils.findGroupById(this.groups, symbol.group);
            const i = g.symbols.findIndex(s => s.id === symbol.id);
            g.symbols.splice(i, 1);
            symbol.group = group.id;
            toGroup.symbols.push(symbol);
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
     * Adds a new group to the list.
     *
     * @param {SymbolGroup} createdGroup The created group.
     */
    addGroup(createdGroup) {
        if (createdGroup.parent == null) {
            this.groups.push(createdGroup);
        } else {
            const g = SymbolGroupUtils.findGroupById(this.groups, createdGroup.parent);
            g.groups.push(createdGroup);
        }
    }

    /**
     * Updates a symbol group in the scope by changing its name property to the one of the groups that is passed
     * as a parameter.
     *
     * @param {SymbolGroup} updatedGroup - The updated symbol group.
     */
    updateGroup(updatedGroup) {
        let group = null;
        if (updatedGroup.parent == null) {
            group = this.groups.find(g => g.id === updatedGroup.id);
        } else {
            group = SymbolGroupUtils.findGroupById(this.groups, updatedGroup.id);
        }
        group.name = updatedGroup.name;
    }

    /**
     * Removes a symbol group from the scope and also removes its symbols.
     *
     * @param {SymbolGroup} group - The group to delete.
     */
    deleteGroup(group) {
        this.removeSymbols(group.symbols);
        if (group.parent == null) {
            remove(this.groups, {id: group.id});
        } else {
            const g = SymbolGroupUtils.findGroupById(this.groups, group.parent);
            remove(g.groups, {id: group.id});
        }
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
}

export const symbolsViewComponent = {
    controller: SymbolsViewComponent,
    controllerAs: 'vm',
    template: require('./symbols-view.component.html')
};
