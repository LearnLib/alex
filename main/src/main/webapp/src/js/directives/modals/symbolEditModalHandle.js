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

import {Symbol} from '../../entities/Symbol';
import {events} from '../../constants';

/**
 * Handles the behaviour of the modal to edit an existing symbol and updates the edited symbol on the server.
 */
// @ngInject
class SymbolEditModalController {

    /**
     * Constructor
     * @param $uibModalInstance
     * @param modalData
     * @param SymbolResource
     * @param ToastService
     * @param EventBus
     */
    constructor($uibModalInstance, modalData, SymbolResource, ToastService, EventBus) {
        this.$uibModalInstance = $uibModalInstance;
        this.modalData = modalData;
        this.SymbolResource = SymbolResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The symbol to edit
         * @type {Symbol}
         */
        this.symbol = modalData.symbol;

        /**
         * A copy of the old symbol
         * @type {Symbol}
         */
        this.symbolCopy = new Symbol(modalData.symbol);

        /**
         * The error message that is displayed when update fails
         * @type {null|string}
         */
        this.errorMsg = null;
    }

    /** Make a request to the API in order to update the symbol. Close the modal on success. */
    updateSymbol() {
        this.errorMsg = null;

        // do not update on server
        if (angular.isDefined(this.modalData.updateOnServer) && !this.modalData.updateOnServer) {
            this.EventBus.emit(events.SYMBOL_UPDATED, {
                newSymbol: this.symbol,
                oldSymbol: this.symbolCopy
            });
            this.$uibModalInstance.dismiss();
            return;
        }

        // update the symbol and close the modal dialog on success with the updated symbol
        this.SymbolResource.update(this.symbol)
            .then(updatedSymbol => {
                this.ToastService.success('Symbol updated');
                this.EventBus.emit(events.SYMBOL_UPDATED, {symbol: updatedSymbol});
                this.$uibModalInstance.dismiss();
            })
            .catch(response => {
                this.errorMsg = response.data.message;
            });
    }

    /** Close the modal dialog */
    close() {
        this.$uibModalInstance.dismiss();
    }
}

/**
 * The directive that handles the modal window for the editing of a new symbol. It attaches an click event to the
 * attached element that opens the modal dialog.
 *
 * Use it as an attribute like 'symbol-edit-modal-handle'
 *
 * @param $uibModal - The $modal service
 * @returns {{restrict: string, scope: {symbol: string, updateOnServer: string}, link: link}}
 */
// @ngInject
function symbolEditModalHandle($uibModal) {
    return {
        restrict: 'A',
        scope: {
            symbol: '=',
            updateOnServer: '='
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {
            $uibModal.open({
                templateUrl: 'html/modals/symbol-edit-modal.html',
                controller: SymbolEditModalController,
                controllerAs: 'vm',
                resolve: {
                    modalData: function () {
                        return {
                            symbol: new Symbol(scope.symbol),
                            updateOnServer: scope.updateOnServer
                        };
                    }
                }
            });
        });
    }
}

export {symbolEditModalHandle, SymbolEditModalController};