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

import {ModalComponent} from '../modal.component';
import {ActionService} from '../../../services/action.service';
import {SymbolResource} from '../../../services/resources/symbol-resource.service';
import {ProjectService} from '../../../services/project.service';
import {Project} from '../../../entities/project';
import {Action} from '../../../entities/actions/action';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';

/**
 * The component for the modal dialog that handles the editing of an action.
 */
export const actionEditModalComponent = {
  template: require('./action-edit-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class ActionEditModalComponent extends ModalComponent {

    /** The action under edit. */
    public action: Action;

    /** All symbols. */
    public symbols: AlphabetSymbol[];

    /**
     * Constructor.
     *
     * @param actionService
     * @param symbolResource
     * @param projectService
     */
    // @ngInject
    constructor(private actionService: ActionService,
                private symbolResource: SymbolResource,
                private projectService: ProjectService) {
      super();

      this.action = null;
      this.symbols = [];

      // fetch all symbols so that symbols have access to it
      const project: Project = this.projectService.store.currentProject;
      this.symbolResource.getAll(project.id).then(symbols => {
        this.symbols = symbols;
      });
    }

    $onInit(): void {
      this.action = this.resolve.modalData.action;
    }

    /** Close the modal dialog and pass the updated action to the handle that called it. */
    updateAction(): void {
      this.close({$value: this.action});
    }
  },
};
