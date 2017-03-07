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

import remove from "lodash/remove";
import uniqueId from "lodash/uniqueId";
import max from "lodash/max";
import {events} from "../../constants";
import {AlphabetSymbol} from "../../entities/AlphabetSymbol";

/**
 * The controller that handles the import of symbols from a *.json file.
 */
class SymbolsImportView {

    /**
     * Constructor.
     *
     * @param $scope
     * @param {SessionService} SessionService
     * @param {SymbolResource} SymbolResource
     * @param {ToastService} ToastService
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor($scope, SessionService, SymbolResource, ToastService, EventBus) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The symbols that will be uploaded.
         * @type {AlphabetSymbol[]}
         */
        this.symbols = [];

        /**
         * The list of selected symbols.
         * @type {AlphabetSymbol[]}
         */
        this.selectedSymbols = [];

        /**
         * If references to symbol ids from executeSymbol actions should be adjusted or not.
         * @type {boolean}
         */
        this.adjustReferences = true;

        // listen on the symbol updated event
        EventBus.on(events.SYMBOL_UPDATED, (evt, data) => {
            this.updateSymbol(data.newSymbol);
        }, $scope);
    }

    /**
     * Creates instances of Symbols from the json string from the *.json file and puts them in the scope.
     *
     * @param {string} data - The json string of loaded symbols.
     */
    fileLoaded(data) {
        try {
            this.symbols = JSON.parse(data).map(s => {
                s.id = uniqueId();
                return new AlphabetSymbol(s);
            });
        } catch (e) {
            this.ToastService.danger('<p><strong>Loading json file failed</strong></p> The file is not properly formatted');
        }
    }

    /**
     * Makes an API request in order to create the selected symbols. Removes successfully created symbols from the
     * scope.
     */
    uploadSelectedSymbols() {
        if (this.selectedSymbols.length > 0) {
            this.SymbolResource.getAll(this.project.id)
                .then(existingSymbols => {
                    let maxId = max(existingSymbols, 'id');
                    maxId = typeof maxId === "undefined" ? 0 : maxId;
                    const symbols = this.selectedSymbols.map(s => new AlphabetSymbol(s));
                    symbols.forEach(symbol => {
                        delete symbol.id;

                        // search in all actions of all symbols for an action with the type EXECUTE_SYMBOL and
                        // adjust referenced ids according to the max. existing id
                        if (existingSymbols.length > 0 && this.adjustReferences) {
                            symbol.actions.forEach(action => {
                                if (action.type === 'executeSymbol') {
                                    action.symbolToExecute.id += maxId;
                                }
                            });
                        }
                    });

                    this.SymbolResource.createMany(this.project.id, symbols)
                        .then(createdSymbols => {
                            this.ToastService.success('Symbols uploaded');
                            createdSymbols.forEach(symbol => {
                                remove(this.symbols, {name: symbol.name});
                            });
                        })
                        .catch(() => {
                            this.ToastService.danger('<p><strong>Symbol upload failed</strong></p> It seems at least on symbol already exists');
                        });
                });
        }
    }

    /**
     * Remove selected symbols from the list.
     */
    removeSelectedSymbols() {
        this.selectedSymbols.forEach(symbol => {
            remove(this.symbols, {name: symbol.name});
        });
    }

    /**
     * Changes the name and/or the abbreviation a symbol before uploading it to prevent naming conflicts in the
     * database.
     *
     * @param {AlphabetSymbol} updatedSymbol - The updated symbol.
     */
    updateSymbol(updatedSymbol) {

        // check if the name already exists
        let symbol = this.symbols.find(s => s.name === updatedSymbol.name);
        if (symbol && symbol.id !== updatedSymbol.id) {
            this.ToastService.danger(`The symbol with the name "${updatedSymbol.name}" already exists.`);
            return;
        }

        // check if the abbreviation already exists
        symbol = this.symbols.find(s => s.abbreviation === updatedSymbol.abbreviation);
        if (symbol && symbol.id !== updatedSymbol.id) {
            this.ToastService.danger(`The symbol with the abbreviation "${updatedSymbol.abbreviation}" already exists.`);
            return;
        }

        // update name and abbreviation
        symbol = this.symbols.find(s => s.id === updatedSymbol.id);
        symbol.name = updatedSymbol.name;
        symbol.abbreviation = updatedSymbol.abbreviation;
        this.ToastService.success('The symbol has been updated');
    }
}

export const symbolsImportView = {
    controller: SymbolsImportView,
    controllerAs: 'vm',
    templateUrl: 'html/components/views/symbols-import-view.html'
};