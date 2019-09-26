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

import { AlphabetSymbol } from '../../../entities/alphabet-symbol';

/**
 * The component to edit a symbols name.
 */
export const symbolEditFormComponent = {
  template: require('./symbol-edit-form.component.html'),
  bindings: {
    symbolRef: '=symbol',
    onUpdated: '&',
    onAborted: '&'
  },
  controller: class SymbolEditFormComponent {

    public onUpdated: (any) => void;

    public onAborted: () => void;

    public symbolRef: AlphabetSymbol;

    public symbol: AlphabetSymbol = null;

    $onInit() {
      this.symbol = JSON.parse(JSON.stringify(this.symbolRef));
    }
  },
  controllerAs: 'vm'
};
