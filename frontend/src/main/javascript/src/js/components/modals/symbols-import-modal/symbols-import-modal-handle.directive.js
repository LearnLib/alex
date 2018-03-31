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

/**
 * The handle to open the symbol import modal.
 *
 * @param $uibModal
 * @return {{restrict: string, scope: {onImported: string}, link(*=, *): void}}
 */
// @ngInject
export function symbolsImportModalHandleDirective($uibModal) {
    return {
        restrict: 'A',
        scope: {
            onImported: '&'
        },
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'symbolsImportModal',
                    size: 'lg',
                }).result.then(symbols => {
                    scope.onImported({symbols});
                });
            });
        }
    };
}
