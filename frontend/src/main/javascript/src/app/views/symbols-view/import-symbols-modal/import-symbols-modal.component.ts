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

import { SymbolGroupUtils } from '../../../utils/symbol-group-utils';
import { SymbolApiService } from '../../../services/resources/symbol-api.service';
import { ToastService } from '../../../services/toast.service';
import { SymbolGroupApiService } from '../../../services/resources/symbol-group-api.service';
import { SymbolGroup } from '../../../entities/symbol-group';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input } from '@angular/core';

/**
 * The component for the symbols import modal window.
 */
@Component({
  selector: 'symbols-import-modal',
  templateUrl: './import-symbols-modal.component.html'
})
export class ImportSymbolsModalComponent {

  /** The groups in the project. */
  @Input()
  groups: SymbolGroup[] = [];

  /** The error message. */
  errorMessage: string = null;

  /** The selected group where the symbols are imported to. */
  selectedGroup: SymbolGroup = null;

  /** The data to import */
  importData: any = null;

  constructor(private symbolApi: SymbolApiService,
              private appStore: AppStoreService,
              private toastService: ToastService,
              private symbolGroupApi: SymbolGroupApiService,
              public modal: NgbActiveModal) {
  }

  get project(): Project {
    return this.appStore.project;
  }

  /**
   * Load the symbols from a JSON file.
   *
   * @param data The serialized symbols.
   */
  fileLoaded(data: string): void {
    const importData = JSON.parse(data);
    if (importData.type == null || ['symbolGroups', 'symbols'].indexOf(importData.type) === -1) {
      this.errorMessage = 'The file does not seem to contain symbols.';
    } else {
      this.importData = importData;
    }
  }

  /**
   * Import the symbols and close the modal window on success.
   */
  importSymbols(): void {
    this.errorMessage = null;

    if (this.importData.type === 'symbols') {
      const defaultGroup = SymbolGroupUtils.findDefaultGroup(this.groups);
      this.importData.symbols.forEach(symbol => {
        symbol.group = this.selectedGroup == null ? defaultGroup.id : this.selectedGroup.id;
      });

      this.symbolApi.createMany(this.project.id, this.importData.symbols).subscribe(
        createdSymbols => {
          this.toastService.success('The symbols have been imported');
          this.modal.close({type: 'symbols', symbols: createdSymbols});
        },
        res => {
          this.errorMessage = `The symbols could not be imported. ${res.error.message}`;
        }
      );
    } else {
      this.symbolGroupApi.importMany(this.project.id, this.importData.symbolGroups).subscribe(
        importedGroups => {
          this.toastService.success('The symbols have been imported');
          this.modal.close({type: 'symbolGroups', groups: importedGroups});
        },
        res => {
          this.errorMessage = `The symbols could not be imported. ${res.error.message}`;
        }
      );
    }
  }

  selectGroup(group: SymbolGroup): void {
    this.selectedGroup = group === this.selectedGroup ? null : group;
  }
}
