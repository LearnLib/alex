/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { SymbolApiService } from '../../../services/api/symbol-api.service';
import { SymbolGroupApiService } from '../../../services/api/symbol-group-api.service';
import { ToastService } from '../../../services/toast.service';
import { SymbolGroup } from '../../../entities/symbol-group';
import { AppStoreService } from '../../../services/app-store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';

/**
 * The controller that handles the moving of symbols into another group.
 */
@Component({
  selector: 'move-symbols-modal',
  templateUrl: './move-symbols-modal.component.html'
})
export class MoveSymbolsModalComponent implements OnInit {

  /** The list of symbols that should be moved. */
  @Input()
  symbols: AlphabetSymbol[];

  /** The list of existing symbol groups. */
  groups: SymbolGroup[];

  /** The symbol group the symbols should be moved into. */
  selectedGroup: SymbolGroup;

  errorMessage: string;

  constructor(private symbolApi: SymbolApiService,
              private symbolGroupApi: SymbolGroupApiService,
              private appStore: AppStoreService,
              private toastService: ToastService,
              public modal: NgbActiveModal) {
    this.groups = [];
    this.symbols = [];
  }

  ngOnInit(): void {
    this.symbolGroupApi.getAll(this.appStore.project.id).subscribe(
      groups => this.groups = groups
    );
  }

  /**
   * Moves the symbols into the selected group by changing the group property of each symbol and then batch
   * updating them on the server.
   */
  moveSymbols(): void {
    if (this.selectedGroup != null) {
      this.errorMessage = null;

      const symbolsToMove = this.symbols.map(s => new AlphabetSymbol(s));
      symbolsToMove.forEach(s => {
        s.group = this.selectedGroup.id;
      });

      this.symbolApi.moveMany(symbolsToMove, this.selectedGroup).subscribe(
        () => {
          this.toastService.success('Symbols move to group <strong>' + this.selectedGroup.name + '</strong>');
          this.modal.close(this.selectedGroup);
        },
        res => {
          this.errorMessage = 'Failed to move symbols: ' + res.error.message;
        }
      );
    }
  }

  /**
   * Selects the group where the symbols should be moved into.
   *
   * @param group The group to select.
   */
  selectGroup(group: SymbolGroup): void {
    this.selectedGroup = this.selectedGroup === group ? null : group;
  }
}
