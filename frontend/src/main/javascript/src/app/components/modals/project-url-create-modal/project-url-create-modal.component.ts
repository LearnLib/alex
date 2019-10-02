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
import { IFormController } from 'angular';
import { ProjectUrl } from '../../../entities/project-url';
import { ProjectEnvironmentApiService } from '../../../services/resources/project-environment-api.service';
import { ProjectEnvironment } from '../../../entities/project-environment';

export const projectUrlCreateModalComponent = {
  template: require('html-loader!./project-url-create-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class ProjectUrlCreateModalComponent extends ModalComponent {

    private environment: ProjectEnvironment;

    public form: IFormController;

    public url: ProjectUrl;
    public errorMessage: string;

    /* @ngInject */
    constructor(private projectEnvironmentApi: ProjectEnvironmentApiService) {
      super();
      this.url = new ProjectUrl();
    }

    $onInit() {
      this.environment = this.resolve.environment;
    }

    /**
     * Updates the project. Closes the modal window on success.
     */
    createUrl(): void {
      this.errorMessage = null;
      this.projectEnvironmentApi.createUrl(this.environment.project, this.environment.id, this.url).subscribe(
        urls => this.close({$value: urls}),
          err => {
          this.errorMessage = `The URL could not be created. ${err.data.message}`;
          }
      );
    }
  },
};
