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
import { ProjectEnvironmentApiService } from '../../../services/resources/project-environment-api.service';
import { ProjectEnvironment } from '../../../entities/project-environment';
import { ProjectEnvironmentVariable } from "../../../entities/project-environment-variable";

export const environmentVariableCreateModalComponent = {
  template: require('html-loader!./environment-variable-create-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class EnvironmentVariableCreateModalComponent extends ModalComponent {

    private environment: ProjectEnvironment;

    public variable: ProjectEnvironmentVariable;
    public errorMessage: string;

    /* @ngInject */
    constructor(private projectEnvironmentApi: ProjectEnvironmentApiService) {
      super();
      this.variable = new ProjectEnvironmentVariable();
    }

    $onInit() {
      this.environment = this.resolve.environment;
    }

    createVariable(): void {
      this.errorMessage = null;
      this.projectEnvironmentApi.createVariable(this.environment.project, this.environment.id, this.variable).subscribe(
        createdVariable => {
          this.close({$value: createdVariable});
        },
        err => {
          this.errorMessage = `The variable could not be created. ${err.data.message}`;
        }
      );
    }
  },
};
