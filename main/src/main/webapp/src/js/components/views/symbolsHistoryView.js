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

import {AlphabetSymbol} from '../../entities/AlphabetSymbol';

/**
 * The controller for the page where the revision history if a symbol is listed and old revisions can be restored
 */
// @ngInject
class SymbolsHistoryView {

    /**
     * Constructor
     * @param $stateParams
     * @param SymbolResource
     * @param SessionService
     * @param ToastService
     * @param ErrorService
     */
    constructor($stateParams, SymbolResource, SessionService, ToastService, ErrorService) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;

        // The project in the session
        const project = SessionService.getProject();

        /**
         * All revisions of a symbol
         * @type {AlphabetSymbol[]}
         */
        this.revisions = [];

        /**
         * The most current version of a symbol
         * @type {AlphabetSymbol}
         */
        this.latestRevision = null;

        // load all revisions of the symbol whose id is passed in the URL
        this.SymbolResource.getRevisions(project.id, $stateParams.symbolId)
            .then(revisions => {
                this.latestRevision = revisions.pop();
                this.revisions = revisions;
            })
            .catch(() => {
                ErrorService.setErrorMessage('The symbol with the ID "' + $stateParams.symbolId + '" could not be found');
            });
    }

    /**
     * Restores a previous revision of a symbol by updating the latest with the properties of the revision
     * @param {AlphabetSymbol} revision - The revision of the symbol that should be restored
     */
    restoreRevision(revision) {
        const symbol = new AlphabetSymbol(this.latestRevision);

        // copy all important properties from the revision to the latest
        symbol.name = revision.name;
        symbol.abbreviation = revision.abbreviation;
        symbol.actions = revision.actions;

        // update symbol with new properties
        this.SymbolResource.update(symbol)
            .then(updatedSymbol => {
                this.ToastService.success('Updated symbol to revision <strong>' + revision.revision + '</strong>');
                this.revisions.unshift(this.latestRevision);
                this.latestRevision = updatedSymbol;
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Update to revision failed</strong></p>' + response.data.message);
            });
    }
}

export const symbolsHistoryView = {
    controller: SymbolsHistoryView,
    controllerAs: 'vm',
    templateUrl: 'html/pages/symbols-history.html'
};