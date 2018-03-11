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

import {AlphabetSymbol} from '../../../entities/alphabet-symbol';

/**
 * The directive that handles the modal window for the editing of a new symbol. It attaches an click event to the
 * attached element that opens the modal dialog.
 *
 * Use it as an attribute like 'symbol-edit-modal-handle'.
 *
 * @param $uibModal - The $modal service.
 * @returns {{restrict: string, scope: {symbol: string, updateOnServer: string}, link: Function}}
 */
// @ngInject
export function symbolEditModalHandleDirective($uibModal) {
    return {
        restrict: 'A',
        scope: {
            symbol: '=',
            updateOnServer: '='
        },
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'symbolEditModal',
                    resolve: {
                        modalData: () => ({
                            symbol: new AlphabetSymbol(JSON.parse(JSON.stringify(scope.symbol))),
                            updateOnServer: scope.updateOnServer
                        })
                    }
                });
            });
        }
    };
}
