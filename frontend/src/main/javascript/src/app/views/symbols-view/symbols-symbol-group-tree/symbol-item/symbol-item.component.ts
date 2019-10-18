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

import { AlphabetSymbol } from '../../../../entities/alphabet-symbol';
import { Selectable } from '../../../../utils/selectable';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'symbol-item',
  templateUrl: './symbol-item.component.html'
})
export class SymbolItemComponent {

  /** The symbol that is displayed. */
  @Input()
  symbol: AlphabetSymbol;

  /** The selectable model. */
  @Input()
  selectedSymbols: Selectable<AlphabetSymbol>;

  /** If the symbol can be selected. */
  @Input()
  selectable: boolean;

  selectSymbol(symbol: AlphabetSymbol): void {
    this.selectedSymbols.select(symbol);
  }
}
