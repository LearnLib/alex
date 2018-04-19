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
     * @param {ProjectResource} ProjectResource
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(ProjectResource, ToastService) {
        this.ProjectResource = ProjectResource;
        this.ToastService = ToastService;

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
            this.ToastService.danger('You have to specify at least one URL.');
            return;
        }

        this.ProjectResource.create(this.project)
            .then(createdProject => {
                this.ToastService.success(`Project "${createdProject.name}" created`);
                this.onCreated({project: createdProject});
                this.project = new Project();

                // set the form to its original state
                this.form.$setPristine();
                this.form.$setUntouched();
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Creation of project failed</strong></p>' + response.data.message);
            });
    }
}

export const projectCreateFormComponent = {
    template: require('./project-create-form.component.html'),
    bindings: {
        onCreated: '&'
    },
    controller: ProjectCreateFormComponent,
    controllerAs: 'vm'
};
