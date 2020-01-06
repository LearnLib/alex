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

import { AlphabetSymbol } from '../../../../entities/alphabet-symbol';
import { Component, Input } from '@angular/core';
import { SymbolsViewStoreService } from '../../symbols-view-store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SymbolUsagesModalComponent } from '../../../../common/modals/symbol-usages-modal/symbol-usages-modal.component';

@Component({
  selector: 'symbol-item',
  templateUrl: './symbol-item.component.html',
  styleUrls: ['./symbol-item.component.scss']
})
export class SymbolItemComponent {

  /** The symbol that is displayed. */
  @Input()
  symbol: AlphabetSymbol;

  constructor(public store: SymbolsViewStoreService,
              private modal: NgbModal) {
  }

  showSymbolUsages() {
    const modalRef = this.modal.open(SymbolUsagesModalComponent);
    modalRef.componentInstance.symbol = this.symbol;
  }
}
