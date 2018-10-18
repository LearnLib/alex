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

import {ProjectService} from '../../../services/project.service';
import {ToastService} from '../../../services/toast.service';
import {Project} from '../../../entities/project';

/**
 * The controller that shows the page to manage projects.
 */
export const projectsViewComponent = {
  template: require('./projects-view.component.html'),
  controllerAs: 'vm',
  controller: class ProjectsViewComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param projectService
     * @param toastService
     */
    // @ngInject
    constructor(private $state: any,
                private projectService: ProjectService,
                private toastService: ToastService) {

      // go to the dashboard if there is a project in the session
      const project = this.projectService.store.currentProject;
      if (project !== null) {
        this.$state.go('project', {projectId: project.id});
        return;
      }

      //get all projects from the server
      this.projectService.load()
        .catch(err => this.toastService.danger(`Loading project failed. ${err.data.message}`));
    }

    get projects(): Project[] {
      return this.projectService.store.projects;
    }
  }
};
