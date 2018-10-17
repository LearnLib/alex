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

import {Project} from '../../../entities/project';

/**
 * The class of the project create form component.
 */
class ProjectCreateFormComponent {

    /**
     * Constructor.
     *
     * @param projectService
     * @param toastService
     */
    // @ngInject
    constructor(projectService, toastService) {
        this.projectService = projectService;
        this.toastService = toastService;

        /**
         * The empty project model that is used for the form.
         * @type {Project}
         */
        this.project = new Project();
    }

    /**
     * Creates a new project.
     */
    createProject() {
        if (this.project.urls.length === 0) {
            this.toastService.danger('You have to specify at least one URL.');
            return;
        }

        this.projectService.create(this.project)
            .then(createdProject => {
                this.toastService.success(`Project "${createdProject.name}" created`);
                this.project = new Project();

                // set the form to its original state
                this.form.$setPristine();
                this.form.$setUntouched();
            })
            .catch(err => {
                this.toastService.danger(`The project could not be created. ${err.data.message}`);
            });
    }
}

export const projectCreateFormComponent = {
    template: require('./project-create-form.component.html'),
    controller: ProjectCreateFormComponent,
    controllerAs: 'vm'
};
