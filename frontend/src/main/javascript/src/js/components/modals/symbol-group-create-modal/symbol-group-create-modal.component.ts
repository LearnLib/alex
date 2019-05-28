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

import {SymbolGroup} from '../../../entities/symbol-group';
import {Project} from '../../../entities/project';
import {ModalComponent} from '../modal.component';
import {ProjectService} from '../../../services/project.service';
import {SymbolGroupResource} from '../../../services/resources/symbol-group-resource.service';
import {ToastService} from '../../../services/toast.service';

/**
 * The controller for the modal dialog that handles the creation of a new symbol group.
 */
export const symbolGroupCreateModalComponent = {
  template: require('./symbol-group-create-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&'
  },
  controllerAs: 'vm',
  controller: class SymbolGroupCreateModalComponent extends ModalComponent {

    /** The new symbol group. */
    public group: SymbolGroup;

    /** All available groups of the project. */
    public groups: SymbolGroup[];

    /** The selected symbol group. */
    public selectedSymbolGroup: SymbolGroup;

    /** An error message that can be displayed in the modal template. */
    public errorMsg: string;


    /**
     * Constructor.
     *
     * @param projectService
     * @param symbolGroupResource
     * @param toastService
     */
    /* @ngInject */
    constructor(private projectService: ProjectService,
                private symbolGroupResource: SymbolGroupResource,
                private toastService: ToastService) {
      super();

      this.group = new SymbolGroup();
      this.groups = [];
      this.selectedSymbolGroup = null;
      this.errorMsg = null;

      this.symbolGroupResource.getAll(this.project.id, true)
        .then(groups => this.groups = groups);
    }

    /**
     * Creates a new symbol group and closes the modal on success and passes the newly created symbol group.
     */
    createGroup(): void {
      this.errorMsg = null;
      this.group.parent = this.selectedSymbolGroup == null ? null : this.selectedSymbolGroup.id;

      this.symbolGroupResource.create(this.project.id, this.group)
        .then(createdGroup => {
          this.toastService.success('Symbol group <strong>' + createdGroup.name + '</strong> created');
          this.close({$value: createdGroup});
          this.dismiss();
        })
        .catch(response => {
          this.errorMsg = response.data.message;
        });
    }

    selectSymbolGroup(group: SymbolGroup): void {
      if (this.selectedSymbolGroup != null && this.selectedSymbolGroup.id === group.id) {
        this.selectedSymbolGroup = null;
      } else {
        this.selectedSymbolGroup = group;
      }
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
