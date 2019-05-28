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

import {events} from '../../../constants';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {ModalComponent} from '../modal.component';
import {SymbolResource} from '../../../services/resources/symbol-resource.service';
import {SymbolGroupResource} from '../../../services/resources/symbol-group-resource.service';
import {ProjectService} from '../../../services/project.service';
import {ToastService} from '../../../services/toast.service';
import {EventBus} from '../../../services/eventbus.service';
import {SymbolGroup} from '../../../entities/symbol-group';
import {Project} from '../../../entities/project';

/**
 * The controller that handles the moving of symbols into another group.
 */
export const symbolMoveModalComponent = {
  template: require('./symbols-move-modal.component.html'),
  bindings: {
    dismiss: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class SymbolMoveModalComponent extends ModalComponent {

    /** The list of symbols that should be moved. */
    public symbols: AlphabetSymbol[];

    /** The list of existing symbol groups. */
    public groups: SymbolGroup[];

    /** The symbol group the symbols should be moved into. */
    public selectedGroup: SymbolGroup;

    public errorMessage: string;

    /**
     * Constructor.
     *
     * @param symbolResource
     * @param symbolGroupResource
     * @param projectService
     * @param toastService
     * @param eventBus
     */
    /* @ngInject */
    constructor(private symbolResource: SymbolResource,
                private symbolGroupResource: SymbolGroupResource,
                private projectService: ProjectService,
                private toastService: ToastService,
                private eventBus: EventBus) {
      super();

      this.symbols = null;
      this.groups = [];
      this.selectedGroup = null;
      this.errorMessage = null;

      const project: Project = projectService.store.currentProject;
      symbolGroupResource.getAll(project.id).then(groups => {
        this.groups = groups;
      });
    }

    $onInit(): void {
      this.symbols = this.resolve.symbols;
    }

    /**
     * Moves the symbols into the selected group by changing the group property of each symbol and then batch
     * updating them on the server.
     */
    moveSymbols(): void {
      if (this.selectedGroup !== null) {
        this.errorMessage = null;

        const symbolsToMove = this.symbols.map(s => new AlphabetSymbol(s));
        symbolsToMove.forEach(s => {
          s.group = this.selectedGroup.id;
        });

        this.symbolResource.moveMany(symbolsToMove, this.selectedGroup)
          .then(() => {
            this.toastService.success('Symbols move to group <strong>' + this.selectedGroup.name + '</strong>');
            this.eventBus.emit(events.SYMBOLS_MOVED, {
              symbols: this.symbols,
              group: this.selectedGroup
            });
            this.dismiss();
          })
          .catch(err => {
            this.errorMessage = "Failed to move symbols: " + err.data.message;
          });
      }
    }

    /**
     * Selects the group where the symbols should be moved into.
     *
     * @param group The group to select.
     */
    selectGroup(group: SymbolGroup): void {
      this.selectedGroup = this.selectedGroup === group ? null : group;
    }
  }
};
