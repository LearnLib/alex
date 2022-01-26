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

import { SymbolGroup } from '../../../entities/symbol-group';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { orderBy } from 'lodash';

/**
 * Recursive component that displays a single item in the symbol group tree.
 */
@Component({
  selector: 'simple-symbol-group-tree-item',
  templateUrl: './simple-symbol-group-tree-item.component.html',
  styleUrls: ['./simple-symbol-group-tree-item.component.scss']
})
export class SimpleSymbolGroupTreeItemComponent {

  @Output()
  groupSelected = new EventEmitter<SymbolGroup>();

  @Output()
  symbolSelected = new EventEmitter<AlphabetSymbol>();

  @Input()
  group: SymbolGroup;

  @Input()
  selectedSymbol: AlphabetSymbol;

  @Input()
  selectedGroup: SymbolGroup;

  collapse = true;

  get orderedGroups(): SymbolGroup[] {
    return orderBy(this.group.groups, ['name']);
  }

  get orderedSymbols(): AlphabetSymbol[] {
    return orderBy(this.group.symbols, ['name']);
  }
}
