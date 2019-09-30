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

import { ProjectService } from '../../../../../services/project.service';
import { Project } from '../../../../../entities/project';
import { GoToWebAction } from '../../../../../entities/actions/web/open-url-action';

export const openActionFormComponent = {
  template: require('html-loader!./open-url-action-form.component.html'),
  bindings: {
    action: '='
  },
  controllerAs: 'vm',
  controller: class OpenUrlActionFormComponent {

    public action: GoToWebAction;
    public selectedBaseUrl: string;

    /* @ngInject */
    constructor(private projectService: ProjectService) {
    }

    $onInit() {
      if (this.action.baseUrl == null) {
        this.action.baseUrl = this.project.getDefaultEnvironment().getDefaultUrl().name;
      }
      this.selectedBaseUrl = this.action.baseUrl;
    }

    handleBaseUrlChange(): void {
      this.action.baseUrl = this.selectedBaseUrl;
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
