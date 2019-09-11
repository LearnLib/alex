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

import { ModalComponent } from '../modal.component';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { SymbolResource } from '../../../services/resources/symbol-resource.service';
import { SymbolUsageResult } from '../../../entities/symbol-usage-result';

export const symbolUsagesModalComponent = {
  template: require('./symbol-usages-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class SymbolUsagesModalComponent extends ModalComponent {

    public symbol: AlphabetSymbol;
    public result: SymbolUsageResult;

    constructor(private symbolResource: SymbolResource,
                private $state: any) {
      super();
    }

    $onInit(): void {
      this.symbol = this.resolve.symbol;
      this.symbolResource.getUsages(this.symbol.project, this.symbol.id).then(
        r => this.result = r
      );
    }
  }
};
