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
 * The controller that handles the import of symbols from a *.json file.
 */
// @ngInject
class SymbolsImportView {

    /**
     * Constructor
     * @param $scope
     * @param SessionService
     * @param SymbolResource
     * @param ToastService
     * @param EventBus
     */
    constructor($scope, SessionService, SymbolResource, ToastService, EventBus) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The symbols that will be uploaded
         * @type {Symbol[]}
         */
        this.symbols = [];

        /**
         * The list of selected symbols
         * @type {Symbol[]}
         */
        this.selectedSymbols = [];

        /**
         * If references to symbol ids from executeSymbol actions should be adjusted or not
         * @type {boolean}
         */
        this.adjustReferences = true;

        // listen on the file loaded event
        EventBus.on(events.FILE_LOADED, (evt, data) => {
            this.fileLoaded(data.file);
        }, $scope);

        // listen on the symbol updated event
        EventBus.on(events.SYMBOL_UPDATED, (evt, data) => {
            this.updateSymbol(data.newSymbol, data.oldSymbol);
        }, $scope);
    }

    /**
     * Creates instances of Symbols from the json string from the *.json file and puts them in the scope.
     *
     * @param {string} data - The json string of loaded symbols
     */
    fileLoaded(data) {
        try {
            this.symbols = angular.fromJson(data).map(s => new Symbol(s));
        } catch (e) {
            this.ToastService.danger('<p><strong>Loading json file failed</strong></p>' + e);
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
                    const maxId = _.max(existingSymbols, 'id').id;
                    const symbols = this.selectedSymbols.map(s => new Symbol(s));
                    symbols.forEach(symbol => {

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
                                _.remove(this.symbols, {name: symbol.name});
                            });
                        })
                        .catch(response => {
                            this.ToastService.danger('<p><strong>Symbol upload failed</strong></p>' + response.data.message);
                        });
                });
        }
    }

    /**
     * Changes the name and/or the abbreviation a symbol before uploading it to prevent naming conflicts in the
     * database.
     *
     * @param {Symbol} updatedSymbol - The updated symbol
     * @param {Symbol} oldSymbol - The old symbol
     */
    updateSymbol(updatedSymbol, oldSymbol) {

        // check whether name or abbreviation already exist and don't update symbol
        if (angular.equals(updatedSymbol, oldSymbol)) {
            return;
        } else if (updatedSymbol.name !== oldSymbol.name &&
            updatedSymbol.abbreviation === oldSymbol.abbreviation) {
            if (_.where(this.symbols, {name: updatedSymbol.name}).length > 0) {
                this.ToastService.danger('Name <strong>' + updatedSymbol.name + '</strong> already exists');
                return;
            }
        } else if (updatedSymbol.abbreviation !== oldSymbol.abbreviation &&
            updatedSymbol.name === oldSymbol.name) {
            if (_.where(this.symbols, {abbreviation: updatedSymbol.abbreviation}).length > 0) {
                this.ToastService.danger('Abbreviation <strong>' + updatedSymbol.abbreviation + '</strong> already exists');
                return;
            }
        }

        // update symbol in scope
        const symbol = this.symbols.find(s => s.name === oldSymbol.name);
        symbol.name = updatedSymbol.name;
        symbol.abbreviation = updatedSymbol.abbreviation;
    }
}

export const symbolsImportView = {
    controller: SymbolsImportView,
    controllerAs: 'vm',
    templateUrl: 'views/pages/symbols-import.html'
};