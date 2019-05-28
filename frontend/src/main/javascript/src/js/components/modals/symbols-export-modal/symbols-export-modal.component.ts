/*
 * Copyright 2015 - 2019 TU Dortmund
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
import {ModalComponent} from '../modal.component';
import {DownloadService} from '../../../services/download.service';
import {ToastService} from '../../../services/toast.service';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {Selectable} from '../../../utils/selectable';

export const symbolsExportModalComponent = {
  template: require('./symbols-export-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class SymbolsExportModalComponent extends ModalComponent {

    /** If only symbols and not symbol groups are exported. */
    public exportSymbolsOnly: boolean;

    /** The name of the file to export. */
    public filename: string;

    /** All symbol groups. */
    public groups: SymbolGroup[] = [];

    /** The selected symbols. */
    public selectedSymbols: Selectable<AlphabetSymbol>;

    /**
     * Constructor.
     *
     * @param downloadService
     * @param toastService
     */
    /* @ngInject */
    constructor(private downloadService: DownloadService,
                private toastService: ToastService) {
      super();

      this.exportSymbolsOnly = false;
      this.filename = 'symbols-' + DateUtils.YYYYMMDD();
    }

    $onInit(): void {
      this.selectedSymbols = this.resolve.selectedSymbols;
      this.groups = this.resolve.groups;
    }

    export(): void {
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
        this.prepareGroups(groupsToExport);
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

    private prepareGroup(group: SymbolGroup): boolean {
      this.prepareGroups(group.groups);
      group.symbols = <any[]> group.symbols
        .filter(s => this.selectedSymbols.isSelected(s))
        .map(s => s.getExportableSymbol());

      return !(group.groups.length === 0 && group.symbols.length === 0);
    }

    private prepareGroups(groups: SymbolGroup[]): void {
      for (let i = 0; i < groups.length; i++) {
        if (!this.prepareGroup(groups[i])) {
          groups.splice(i, 1);
          i--;
        } else {
          delete (<any> groups[i]).$$hashKey;
          delete groups[i].id;
          delete groups[i].project;
        }
      }
    }
  }
};
