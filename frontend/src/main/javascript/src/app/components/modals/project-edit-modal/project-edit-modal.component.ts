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

import { Project } from '../../../entities/project';
import { ModalComponent } from '../modal.component';
import { IFormController } from 'angular';
import { ProjectApiService } from '../../../services/resources/project-api.service';
import { ToastService } from '../../../services/toast.service';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The component of the modal window for editing a project.
 */
export const projectEditModalComponent = {
  template: require('html-loader!./project-edit-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class ProjectEditModalComponent extends ModalComponent {

    /** The form object. */
    public form: IFormController = null;

    /** The project to edit. */
    public project: Project = null;

    /** An error message that is displayed on a failed updated. */
    public errorMessage: string = null;

    /* @ngInject */
    constructor(private projectApi: ProjectApiService,
                private toastService: ToastService,
                private appStore: AppStoreService) {
      super();
    }

    $onInit(): void {
      this.project = this.resolve.project;
    }

    /**
     * Updates the project. Closes the modal window on success.
     */
    updateProject(): void {
      this.errorMessage = null;

      this.projectApi.update(this.project).subscribe(
        updatedProject => {
          this.toastService.success('Project updated');
          this.appStore.openProject(updatedProject);
          this.close({$value: updatedProject});

          // set the form to its original state
          this.form.$setPristine();
          this.form.$setUntouched();
        },
        err => {
          this.errorMessage = err.data.message;
        }
      );
    }
  },
};
