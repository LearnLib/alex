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

import { events } from '../../../constants';
import { SymbolGroup } from '../../../entities/symbol-group';
import { ModalComponent } from '../modal.component';
import { SymbolGroupResource } from '../../../services/resources/symbol-group-resource.service';
import { ToastService } from '../../../services/toast.service';
import { EventBus } from '../../../services/eventbus.service';
import { PromptService } from '../../../services/prompt.service';

/**
 * The controller that handles the modal dialog for deleting and updating a symbol group. The modal data that is
 * passed must have an property 'group' whose value should be an instance of SymbolGroup.
 */
export const symbolGroupEditModalComponent = {
  template: require('./symbol-group-edit-modal.component.html'),
  bindings: {
    dismiss: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class SymbolGroupEditModalComponent extends ModalComponent {

    /** The symbol group that should be edited. */
    public group: SymbolGroup = null;

    /** An error message that can be displayed in the template. */
    public errorMessage: string = null;

    /**
     * Constructor.
     *
     * @param symbolGroupResource
     * @param toastService
     * @param eventBus
     * @param promptService
     */
    /* @ngInject */
    constructor(private symbolGroupResource: SymbolGroupResource,
                private toastService: ToastService,
                private eventBus: EventBus,
                private promptService: PromptService) {
      super();
    }

    $onInit(): void {
      this.group = this.resolve.group;
    }

    /**
     * Updates the symbol group under edit and closes the modal dialog on success.
     */
    updateGroup(): void {
      this.errorMessage = null;

      this.group.symbols = [];
      this.symbolGroupResource.update(this.group)
        .then((updatedGroup: SymbolGroup) => {
          this.toastService.success('Group updated');
          this.eventBus.emit(events.GROUP_UPDATED, {
            group: updatedGroup
          });
          this.dismiss();
        })
        .catch(err => {
          this.errorMessage = err.data.message;
        });
    }
  }
};
