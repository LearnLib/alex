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
 * The handle that opens the result list modal.
 *
 * @param $uibModal
 * @return {{scope: {results: string, onSelected: string}, restrict: string, link(*=, *): void}}
 */
// @ngInject
export function resultListModalHandleDirective($uibModal) {
    return {
        scope: {
            results: '=',
            onSelected: '&'
        },
        restrict: 'A',
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'resultListModal',
                    resolve: {
                        modalData: () => ({
                            results: scope.results
                        })
                    }
                }).result.then(result => {
                    scope.onSelected({result});
                });
            });
        }
    };
}
