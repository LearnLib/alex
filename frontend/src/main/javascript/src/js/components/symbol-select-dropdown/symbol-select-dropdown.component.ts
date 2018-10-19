/*
 * Copyright 2018 TU Dortmund
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

import {SymbolGroup} from '../../entities/symbol-group';
import {AlphabetSymbol} from '../../entities/alphabet-symbol';

export const symbolSelectDropdownComponent = {
  template: require('./symbol-select-dropdown.component.html'),
  bindings: {
    groups: '=',
    onSymbolSelected: '&',
    variant: '@',
  },
  controllerAs: 'vm',
  controller: class SymbolSelectDropdownComponent {

    public groups: SymbolGroup[];
    public onSymbolSelected: (d: any) => void;
    public variant: string;

    public selectedSymbol: AlphabetSymbol;
    public showMenu: boolean;

    constructor() {
      this.selectedSymbol = null;
      this.showMenu = false;
    }

    handleSymbolSelected(symbol: AlphabetSymbol): void {
      this.selectedSymbol = symbol;
      this.showMenu = false;
      this.onSymbolSelected({symbol});
    }

    enableSelection(): void {
      this.showMenu = !this.showMenu;
    }
  }
};
