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

import { SymbolGroup } from '../../entities/symbol-group';
import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { orderBy } from 'lodash';

/**
 * Component that displays the symbol group tree.
 */
@Component({
  selector: 'simple-symbol-group-tree',
  templateUrl: './simple-symbol-group-tree.component.html'
})
export class SimpleSymbolGroupTreeComponent {

  @Output()
  groupSelected = new EventEmitter<SymbolGroup>();

  @Output()
  symbolSelected = new EventEmitter<AlphabetSymbol>();

  @Input()
  groups: SymbolGroup[] = [];

  @Input()
  selectedSymbol: AlphabetSymbol;

  @Input()
  selectedGroup: SymbolGroup;

  get orderedGroups(): SymbolGroup[] {
    return orderBy(this.groups, ['name']);
  }
}
