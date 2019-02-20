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

import {SymbolGroup} from '../../../entities/symbol-group';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';

/**
 * Recursive component that displays a single item in the symbol group tree.
 */
export const simpleSymbolGroupTreeItemComponent = {
  template: require('./simple-symbol-group-tree-item.component.html'),
  bindings: {
    group: '<',
    selectedSymbol: '=',
    selectedSymbolGroup: '=',
    onSymbolGroupSelected: '&',
    onSymbolSelected: '&'
  },
  controllerAs: 'vm',
  controller: class SimpleSymbolGroupTreeItemComponent {

    public onSymbolGroupSelected: (any) => void;

    public onSymbolSelected: (any) => void;

    /** If the symbol group is collapsed. */
    public collapse: boolean = true;

    /** The symbol group. */
    public group: SymbolGroup;

    /** Fired when a symbol group is clicked on. */
    selectSymbolGroup(): void {
      this.symbolGroupSelected(this.group);
    }

    /**
     * Fired when a symbol is clicked on.
     *
     * @param symbol The symbol that is clicked on.
     */
    selectSymbol(symbol: AlphabetSymbol): void {
      this.symbolSelected(symbol);
    }

    /**
     * Wrapper for the 'onSymbolGroupSelected' component attribute that is passed to child components.
     *
     * @param group The selected group that is emitted.
     */
    symbolGroupSelected(group: SymbolGroup): void {
      this.onSymbolGroupSelected({group});
    }

    /**
     * Wrapper for the 'onSymbolSelected' component attribute that is passed to child components.
     *
     * @param symbol The selected symbol that is emitted.
     */
    symbolSelected(symbol: AlphabetSymbol): void {
      this.onSymbolSelected({symbol});
    }
  }
};
