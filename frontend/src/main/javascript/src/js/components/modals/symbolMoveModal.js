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

import {events} from '../../constants';
import {AlphabetSymbol} from '../../entities/AlphabetSymbol';

/**
 * The controller that handles the moving of symbols into another group.
 */
export class SymbolMoveModalComponent {

    /**
     * Constructor.
     *
     * @param {SymbolResource} SymbolResource
     * @param {SymbolGroupResource} SymbolGroupResource
     * @param {SessionService} SessionService
     * @param {ToastService} ToastService
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor(SymbolResource, SymbolGroupResource, SessionService, ToastService, EventBus) {
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        const project = SessionService.getProject();

        /**
         * The list of symbols that should be moved.
         * @type {AlphabetSymbol[]}
         */
        this.symbols = null;

        /**
         * The list of existing symbol groups.
         * @type {SymbolGroup[]}
         */
        this.groups = [];

        /**
         * The symbol group the symbols should be moved into.
         * @type {SymbolGroup|null}
         */
        this.selectedGroup = null;

        // fetch all symbolGroups
        SymbolGroupResource.getAll(project.id).then(groups => {
            this.groups = groups;
        });
    }

    $onInit() {
        this.symbols = this.resolve.modalData.symbols;
    }

    /**
     * Moves the symbols into the selected group by changing the group property of each symbol and then batch
     * updating them on the server.
     */
    moveSymbols() {
        if (this.selectedGroup !== null) {

            const symbolsToMove = this.symbols.map(s => new AlphabetSymbol(s));
            symbolsToMove.forEach(s => {
                s.group = this.selectedGroup.id;
            });

            this.SymbolResource.moveMany(symbolsToMove, this.selectedGroup)
                .then(() => {
                    this.ToastService.success('Symbols move to group <strong>' + this.selectedGroup.name + '</strong>');
                    this.EventBus.emit(events.SYMBOLS_MOVED, {
                        symbols: this.symbols,
                        group: this.selectedGroup
                    });
                    this.dismiss();
                })
                .catch(response => {
                    this.ToastService.danger('<p><strong>Moving symbols failed</strong></p>' + response.data.message);
                });
        }
    }

    /**
     * Selects the group where the symbols should be moved into.
     *
     * @param {SymbolGroup} group - The group to select.
     */
    selectGroup(group) {
        this.selectedGroup = this.selectedGroup === group ? null : group;
    }
}

export const symbolMoveModalComponent = {
    templateUrl: 'html/components/modals/symbol-move-modal.html',
    bindings: {
        dismiss: '&',
        resolve: '='
    },
    controller: SymbolMoveModalComponent,
    controllerAs: 'vm'
};

/**
 * The directive for handling the opening of the modal for moving symbols into another group. Can only be used as
 * an attribute and attaches a click event to its source element.
 *
 * Use: '<button symbol-move-modal-handle symbols="...">Click Me!</button>'.
 *
 * @param $uibModal - The ui.bootstrap $modal service
 * @returns {{scope: {symbols: string}, link: Function}}
 */
// @ngInject
export function symbolMoveModalHandle($uibModal) {
    return {
        restrict: 'A',
        scope: {
            symbols: '='
        },
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'symbolMoveModal',
                    resolve: {
                        modalData: function () {
                            return {symbols: scope.symbols.map(s => new AlphabetSymbol(s))};
                        }
                    }
                });
            });
        }
    };
}
