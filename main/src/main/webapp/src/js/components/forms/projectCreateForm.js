/*
 * Copyright 2016 TU Dortmund
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

import {events} from '../../constants';
import {Project} from '../../entities/Project';

/** The class of the project create form component */
// @ngInject
class ProjectCreateForm {

    /**
     * Constructor
     * @param $scope
     * @param {ProjectResource} ProjectResource
     * @param {ToastService} ToastService
     * @param {EventBus} EventBus
     */
    constructor($scope, ProjectResource, ToastService, EventBus) {
        this.ProjectResource = ProjectResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The empty project model that is used for the form
         * @type {Project}
         */
        this.project = new Project();

        /**
         * The project that should be imported
         * @type {Project}
         */
        this.projectToImport = null;

        EventBus.on(events.FILE_LOADED, (evt, data) => {
            this.projectToImport = JSON.parse(data.file);
        }, $scope);
    }

    /** Creates a new project */
    createProject() {
        this.ProjectResource.create(this.project)
            .then(createdProject => {
                this.ToastService.success(`Project "${createdProject.name}" created`);
                this.EventBus.emit(events.PROJECT_CREATED, {project: createdProject});
                this.project = new Project();

                // set the form to its original state
                this.form.$setPristine();
                this.form.$setUntouched();
            })
            .catch(response => {
                this.ToastService.danger('<p><strong>Creation of project failed</strong></p>' + response.data.message);
            });
    }

    /** Imports a project **/
    importProject() {
        if (this.projectToImport !== null) {
            this.ProjectResource.create(this.projectToImport)
                .then(importedProject => {
                    this.EventBus.emit(events.PROJECT_CREATED, {project: importedProject});
                    this.projectToImport = null;
                    this.ToastService.success(`The project '${importedProject.name}' has been imported.`)
                })
                .catch(response => {
                    this.ToastService.danger(`<p><strong>The import failed!</strong></p> ${response.data.message}`)
                });
        }
    }
}

const projectCreateForm = {
    controller: ProjectCreateForm,
    controllerAs: 'vm',
    templateUrl: 'html/components/project-create-form.html'
};

export default projectCreateForm;