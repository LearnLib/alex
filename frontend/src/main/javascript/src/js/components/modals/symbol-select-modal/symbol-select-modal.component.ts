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

import {ModalComponent} from '../modal.component';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {SymbolGroup} from '../../../entities/symbol-group';
import { ProjectService } from '../../../services/project.service';
import { SymbolGroupResource } from '../../../services/resources/symbol-group-resource.service';

export const symbolSelectModalComponent = {
  template: require('./symbol-select-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class SymbolSelectModalComponent extends ModalComponent {

    /** The selected symbol. */
    public selectedSymbol: AlphabetSymbol = null;

    /** All symbol groups of the current project. */
    public groups: SymbolGroup[] = [];

    /** Constructor. */
    constructor(private projectService: ProjectService,
                private symbolGroupResource: SymbolGroupResource) {
      super();
    }

    $onInit(): void {
      this.symbolGroupResource.getAll(this.projectService.store.currentProject.id, true).then(
        groups => this.groups = groups
      );
    }

    selectSymbol(symbol: AlphabetSymbol): void {
      this.selectedSymbol = symbol;
    }

    selectSymbolAndClose(symbol: AlphabetSymbol): void {
      this.selectSymbol(symbol);
      this.ok();
    }

    ok(): void {
      if (this.selectedSymbol == null) {
        this.dismiss();
      } else {
        this.close({$value: this.selectedSymbol});
      }
    }
  }
};
