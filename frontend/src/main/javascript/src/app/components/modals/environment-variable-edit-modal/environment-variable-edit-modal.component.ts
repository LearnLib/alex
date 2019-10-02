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

export const environmentVariableEditModalComponent = {
  template: require('html-loader!./environment-variable-edit-modal.component.html'),
  bindings: {
    dismiss: '&',
    close: '&',
    resolve: '='
  },
  controllerAs: 'vm',
  controller: class EnvironmentVariableEditModalComponent extends ModalComponent {

    private environment: ProjectEnvironment;

    public variable: ProjectEnvironmentVariable;
    public errorMessage: string;

    /* @ngInject */
    constructor(private projectEnvironmentApi: ProjectEnvironmentApiService) {
      super();
    }

    $onInit() {
      this.environment = this.resolve.environment;
      this.variable = this.resolve.variable;
    }

    editVariable(): void {
      this.errorMessage = null;
      this.projectEnvironmentApi.updateVariable(this.environment.project, this.environment.id, this.variable.id, this.variable).subscribe(
        updatedVariable => {
          this.close({$value: updatedVariable});
        },
          err => {
          this.errorMessage = `The variable could not be updated. ${err.data.message}`;
        }
      );
    }
  },
};
