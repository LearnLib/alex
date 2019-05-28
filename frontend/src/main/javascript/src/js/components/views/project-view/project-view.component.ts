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

import {ProjectService} from '../../../services/project.service';
import {Project} from '../../../entities/project';

/**
 * The controller of the component for the project dashboard.
 */
export const projectViewComponent = {
  template: require('./project-view.component.html'),
  controllerAs: 'vm',
  controller: class ProjectViewComponent {

    /**
     * Constructor.
     *
     * @param projectService
     */
    /* @ngInject */
    constructor(private projectService: ProjectService) {
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
