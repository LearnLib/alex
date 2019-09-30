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

import { SymbolGroup } from '../../entities/symbol-group';
import { AlphabetSymbol } from '../../entities/alphabet-symbol';

/**
 * Component that displays the symbol group tree.
 */
export const simpleSymbolGroupTreeComponent = {
  template: require('html-loader!./simple-symbol-group-tree.component.html'),
  bindings: {
    groups: '<',
    selectedSymbol: '=',
    selectedSymbolGroup: '=',
    onSymbolGroupSelected: '&',
    onSymbolSelected: '&'
  },
  controllerAs: 'vm',
  controller: class SimpleSymbolGroupTreeComponent {

    public onSymbolGroupSelected: (any) => void;

    public onSymbolSelected: (any) => void;

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
