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

import { orderBy } from 'lodash';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { SymbolGroup } from '../../../entities/symbol-group';
import { Component, Input } from '@angular/core';
import { SymbolsViewStoreService } from '../symbols-view-store.service';

@Component({
  selector: 'symbols-symbol-group-tree',
  templateUrl: './symbols-symbol-group-tree.component.html',
  styleUrls: ['./symbols-symbol-group-tree.component.scss']
})
export class SymbolsSymbolGroupTreeComponent {

  /** The symbol group to display. */
  @Input()
  group: SymbolGroup;

  constructor(public store: SymbolsViewStoreService) {
  }

  get orderedGroups(): SymbolGroup[] {
    return orderBy(this.group.groups, ['name']);
  }

  get orderedSymbols(): AlphabetSymbol[] {
    return orderBy(this.group.symbols, ['name']);
  }
}
