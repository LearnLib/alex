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

import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { SymbolApiService } from '../../../services/api/symbol-api.service';
import { SymbolUsageResult } from '../../../entities/symbol-usage-result';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'symbol-usages-modal',
  templateUrl: './symbol-usages-modal.component.html'
})
export class SymbolUsagesModalComponent implements OnInit {

  @Input()
  symbol: AlphabetSymbol;

  result: SymbolUsageResult;

  constructor(private symbolApi: SymbolApiService,
              public modal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.symbolApi.getUsages(this.symbol.project, this.symbol.id).subscribe(
      r => this.result = r
    );
  }
}
