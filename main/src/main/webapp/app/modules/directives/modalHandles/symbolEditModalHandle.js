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

/**
 * The directive that handles the modal window for the editing of a new symbol. It attaches an click event to the
 * attached element that opens the modal dialog.
 *
 * Use it as an attribute like 'symbol-edit-modal-handle'
 *
 * @param $modal - The $modal service
 * @returns {{restrict: string, scope: {symbol: string, updateOnServer: string}, link: link}}
 */
// @ngInject
function symbolEditModalHandle($modal) {
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
            $modal.open({
                templateUrl: 'views/modals/symbol-edit-modal.html',
                controller: 'SymbolEditModalController',
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

export default symbolEditModalHandle;