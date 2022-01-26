/*
 * Copyright 2015 - 2022 TU Dortmund
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
import { SymbolGroup } from '../../../entities/symbol-group';
import { SymbolGroupApiService } from '../../../services/api/symbol-group-api.service';
import { AppStoreService } from '../../../services/app-store.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'symbol-select-modal',
  templateUrl: './select-symbol-modal.component.html'
})
export class SelectSymbolModalComponent implements OnInit {

  /** The selected symbol. */
  public selectedSymbol: AlphabetSymbol = null;

  /** All symbol groups of the current project. */
  public groups: SymbolGroup[] = [];

  /** Constructor. */
  constructor(private appStore: AppStoreService,
              private symbolGroupApi: SymbolGroupApiService,
              public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.symbolGroupApi.getAll(this.appStore.project.id).subscribe(
      groups => this.groups = groups
    );
  }

  selectSymbol(symbol: AlphabetSymbol): void {
    this.selectedSymbol = symbol;
  }

  selectSymbolAndClose(symbol: AlphabetSymbol): void {
    this.selectSymbol(symbol);
    this.ok();
  }

  ok(): void {
    if (this.selectedSymbol == null) {
      this.modal.dismiss();
    } else {
      this.modal.close(this.selectedSymbol);
    }
  }
}
