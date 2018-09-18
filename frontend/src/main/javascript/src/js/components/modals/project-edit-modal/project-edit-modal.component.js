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
 * The controller of the modal window for editing a project.
 */
export class ProjectEditModalComponent {

    /**
     * Constructor.
     *
     * @param {ProjectResource} ProjectResource
     * @param {ToastService} ToastService
     * @param {ProjectService} ProjectService
     */
    // @ngInject
    constructor(ProjectResource, ToastService, ProjectService) {
        this.ProjectResource = ProjectResource;
        this.ToastService = ToastService;
        this.ProjectService = ProjectService;

        /**
         * The form object.
         */
        this.form = null;

        /**
         * The project to edit.
         * @type {Project}
         */
        this.project = null;

        /**
         * An error message that is displayed on a failed updated.
         * @type {null|string}
         */
        this.errorMessage = null;
    }

    $onInit() {
        this.project = this.resolve.project;
    }

    /**
     * Updates the project. Closes the modal window on success.
     */
    updateProject() {
        this.errorMessage = null;

        this.ProjectResource.update(this.project)
            .then(updatedProject => {
                this.ToastService.success('Project updated');
                this.ProjectService.open(updatedProject);
                this.close({$value: updatedProject});

                // set the form to its original state
                this.form.$setPristine();
                this.form.$setUntouched();
            })
            .catch(err => {
                this.errorMessage = err.data.message;
            });
    }
}

export const projectEditModalComponent = {
    template: require('./project-edit-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controller: ProjectEditModalComponent,
    controllerAs: 'vm',
};
