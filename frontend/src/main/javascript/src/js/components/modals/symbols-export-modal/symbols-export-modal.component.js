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

import {version} from '../../../../../environments';
import {SymbolGroup} from '../../../entities/symbol-group';
import {DateUtils} from '../../../utils/date-utils';

export const symbolsExportModalComponent = {
    template: require('./symbols-export-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controllerAs: 'vm',
    controller: class SymbolsExportModalComponent {

        /**
         * Constructor.
         *
         * @param {DownloadService} DownloadService
         * @param {ToastService} ToastService
         */
        // @ngInject
        constructor(DownloadService, ToastService) {
            this.downloadService = DownloadService;
            this.toastService = ToastService;

            /**
             * If only symbols and not symbol groups are exported.
             * @type {boolean}
             */
            this.exportSymbolsOnly = false;

            /**
             * The name of the file to export.
             * @type {string}
             */
            this.filename = 'symbols-' + DateUtils.YYYYMMDD();
        }

        $onInit() {
            this.selectedSymbols = this.resolve.selectedSymbols;
            this.groups = this.resolve.groups;
        }

        export() {
            let data = {};
            if (this.exportSymbolsOnly) {
                const symbolsToExport = this.selectedSymbols.getSelected().map(s => s.getExportableSymbol());
                data = {
                    version,
                    type: 'symbols',
                    symbols: symbolsToExport
                };
            } else {
                const groupsToExport = JSON.parse(JSON.stringify(this.groups)).map(g => new SymbolGroup(g));
                this._prepareGroups(groupsToExport);
                data = {
                    version,
                    type: 'symbolGroups',
                    symbolGroups: groupsToExport
                };
            }

            this.downloadService.downloadObject(data, this.filename);
            this.toastService.success('The symbols have been exported.');
            this.close();
        }

        _prepareGroup(group) {
            this._prepareGroups(group.groups);
            group.symbols = group.symbols
                .filter(s => this.selectedSymbols.isSelected(s))
                .map(s => s.getExportableSymbol());

            return !(group.groups.length === 0 && group.symbols.length === 0);
        }

        _prepareGroups(groups) {
            for (let i = 0; i < groups.length; i++) {
                if (!this._prepareGroup(groups[i])) {
                    groups.splice(i, 1);
                    i--;
                } else {
                    delete groups[i].$$hashKey;
                    delete groups[i].id;
                    delete groups[i].project;
                }
            }
        }
    }
};
