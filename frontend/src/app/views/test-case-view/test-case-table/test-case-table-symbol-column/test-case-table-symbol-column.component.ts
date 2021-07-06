/*
 * Copyright 2015 - 2021 TU Dortmund
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


import { Component, Input } from '@angular/core';
import { ParametrizedSymbol } from '../../../../entities/parametrized-symbol';
import { AppStoreService } from '../../../../services/app-store.service';
import { SymbolGroup } from '../../../../entities/symbol-group';
import { AlphabetSymbol } from '../../../../entities/alphabet-symbol';
import { SymbolGroupUtils } from '../../../../utils/symbol-group-utils';

@Component({
  selector: 'test-case-table-symbol-column',
  templateUrl: './test-case-table-symbol-column.component.html'
})
export class TestCaseTableSymbolColumnComponent {

  @Input()
  pSymbol: ParametrizedSymbol;

  @Input()
  symbolMap: any;

  @Input()
  groups: SymbolGroup[];

  constructor(public appStore: AppStoreService) {
  }

  getSymbolPath(symbol: AlphabetSymbol): string {
    return SymbolGroupUtils.getSymbolPath(this.groups, symbol);
  }
}
