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

import { SymbolGroupUtils } from '../../../../utils/symbol-group-utils';
import { SymbolGroup } from '../../../../entities/symbol-group';
import { AlphabetSymbol } from '../../../../entities/alphabet-symbol';

export const symbolSearchFormComponent = {
  template: require('./symbol-search-form.component.html'),
  bindings: {
    groups: '<',
    onSelected: '&'
  },
  controllerAs: 'vm',
  controller: class SymbolSearchFormComponent {

    public groups: SymbolGroup[];

    public onSelected: (s: any) => void;

    /**
     * Select a symbol.
     *
     * @param symbol The symbol.
     */
    selectSymbol(symbol: AlphabetSymbol) {
      this.onSelected({symbol});
    }

    /**
     * Get all symbols from the list.
     *
     * @return The symbols.
     */
    getSymbols(): AlphabetSymbol[] {
      return SymbolGroupUtils.getSymbols(this.groups);
    }

    /**
     * Select if a symbol should be displayed in the result list.
     *
     * @param symbol The symbol.
     * @param value The user input.
     * @return If the symbol should be displayed.
     */
    filterSymbol(symbol: AlphabetSymbol, value: string): boolean {
      return symbol.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    }

    /**
     * What information of the symbol should be displayed in the list.
     *
     * @param symbol The symbol.
     * @return The name of the symbol.
     */
    displaySymbol(symbol): string {
      return symbol.name;
    }
  }
};
