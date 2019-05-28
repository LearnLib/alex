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

import {Project} from '../../entities/project';
import {ToastService} from '../../services/toast.service';
import {PromptService} from '../../services/prompt.service';
import {ProjectService} from '../../services/project.service';

/**
 * The component that displays a list of projects.
 */
export const projectListComponent = {
  template: require('./project-list.component.html'),
  bindings: {
    projects: '=',
    onDeleted: '&',
    onUpdated: '&'
  },
  controllerAs: 'vm',
  controller: class ProjectListComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param toastService
     * @param promptService
     * @param projectService
     */
    /* @ngInject */
    constructor(private $state: any,
                private toastService: ToastService,
                private promptService: PromptService,
                private projectService: ProjectService) {
    }

    /**
     * Save a project into the sessionStorage and redirect to its dashboard.
     *
     * @param project The project to work on.
     */
    openProject(project: Project): void {
      this.projectService.open(project);
      this.$state.go('project', {projectId: project.id});
    }

    /**
     * Deletes a project.
     *
     * @param project The project to delete.
     */
    deleteProject(project: Project): void {
      this.promptService.confirm('Do you really want to delete this project? All related data will be lost.')
        .then(() => {
          this.projectService.delete(project)
            .then(() => {
              this.toastService.success(`The project '${project.name}' has been deleted.`);
            })
            .catch(response => {
              this.toastService.danger(`The project could not be deleted. ${response.data.message}`);
            });
        });
    }

    /**
     * Edit the project.
     *
     * @param project The project to edit.
     */
    editProject(project: Project): void {
      this.projectService.update(project)
        .catch(err => this.toastService.danger(`The project could not be update. ${err.data.message}`));
    }
  }
};
