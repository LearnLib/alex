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
import { ProjectService } from '../../../services/project.service';
import { ToastService } from '../../../services/toast.service';
import { ProjectResource } from "../../../services/resources/project-resource.service";

/**
 * The component for the symbols import modal window.
 */
export const projectImportModalComponent = {
  template: require('./project-import-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
  },
  controllerAs: 'vm',
  controller: class ProjectImportModalComponent extends ModalComponent {

    /** The error message. */
    public errorMessage: string = null;

    /** The data to import */
    public importData: any = null;

    public name: string;

    /* @ngInject */
    constructor(private projectResource: ProjectResource,
                private projectService: ProjectService,
                private toastService: ToastService) {
      super();
    }

    /**
     * Load the symbols from a JSON file.
     *
     * @param data The serialized symbols.
     */
    fileLoaded(data: string): void {
      const importData = JSON.parse(data);
      if (importData.type == null || ['project'].indexOf(importData.type) === -1) {
        this.errorMessage = 'The file does not seem to contain a project.';
      } else {
        this.importData = importData;
        this.name = importData.project.name;
      }
    }

    /**
     * Import the symbols and close the modal window on success.
     */
    importProject(): void {
      this.errorMessage = null;

      this.importData.project.name = this.name;
      this.projectService.import(this.importData)
        .then(() => {
          this.toastService.success('The project has been imported');
          this.close();
        })
        .catch(err => {
          this.errorMessage = `The project could not be imported. ${err.data.message}`;
        });
    }
  }
};
