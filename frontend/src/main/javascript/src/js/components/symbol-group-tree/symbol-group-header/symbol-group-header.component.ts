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

import {SymbolGroup} from '../../../entities/symbol-group';
import {Selectable} from '../../../utils/selectable';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';

export const symbolGroupHeaderComponent = {
  template: require('./symbol-group-header.component.html'),
  transclude: true,
  bindings: {
    group: '=',
    selectedSymbols: '=',
    collapse: '='
  },
  controllerAs: 'vm',
  controller: class SymbolGroupHeaderComponent {

    /** The symbol group to display. */
    public group: SymbolGroup;

    /** If the group is collapsed. */
    public collapse: boolean;

    public selectedSymbols: Selectable<AlphabetSymbol>;

    /** Constructor. */
    constructor() {
      this.group = null;
      this.collapse = false;
    }
  }
};
