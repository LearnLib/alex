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

import {events} from '../../constants';

/**
 * The component that displays a list of projects.
 */
class ProjectListComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param {ProjectResource} ProjectResource
     * @param {ToastService} ToastService
     * @param {SessionService} SessionService
     * @param {PromptService} PromptService
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor($state, ProjectResource, ToastService, SessionService, PromptService, EventBus) {
        this.$state = $state;
        this.ProjectResource = ProjectResource;
        this.ToastService = ToastService;
        this.SessionService = SessionService;
        this.PromptService = PromptService;
        this.EventBus = EventBus;
    }

    /**
     * Save a project into the sessionStorage and redirect to its dashboard.
     *
     * @param {Project} project - The project to work on.
     */
    openProject(project) {
        this.SessionService.saveProject(project);
        this.EventBus.emit(events.PROJECT_OPENED, {project});
        this.$state.go('project', {projectId: project.id});
    }

    /**
     * Deletes a project.
     *
     * @param {Project} project - The project to delete.
     */
    deleteProject(project) {
        this.PromptService.confirm('Do you really want to delete this project? All related data will be lost.')
            .then(() => {
                this.ProjectResource.remove(project)
                    .then(() => {
                        this.ToastService.success('Project ' + project.name + ' deleted');
                        this.EventBus.emit(events.PROJECT_DELETED, {project: project});
                    })
                    .catch(response => {
                        this.ToastService.danger(`The project could not be deleted. ${response.data.message}`);
                    });
            });
    }
}

export const projectListComponent = {
    template: require('./project-list.component.html'),
    bindings: {
        projects: '='
    },
    controller: ProjectListComponent,
    controllerAs: 'vm'
};
