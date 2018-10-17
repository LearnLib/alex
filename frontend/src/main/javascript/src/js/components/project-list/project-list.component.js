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

/**
 * The component that displays a list of projects.
 */
class ProjectListComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param toastService
     * @param promptService
     * @param projectService
     */
    // @ngInject
    constructor($state, toastService, promptService, projectService) {
        this.$state = $state;
        this.toastService = toastService;
        this.promptService = promptService;
        this.projectService = projectService;
    }

    /**
     * Save a project into the sessionStorage and redirect to its dashboard.
     *
     * @param {Project} project - The project to work on.
     */
    openProject(project) {
        this.projectService.open(project);
        this.$state.go('project', {projectId: project.id});
    }

    /**
     * Deletes a project.
     *
     * @param {Project} project The project to delete.
     */
    deleteProject(project) {
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
     * @param {Project} project The project to edit.
     */
    editProject(project) {
        this.projectService.update(project)
            .catch(err => this.toastService.danger(`The project could not be update. ${err.data.message}`));
    }
}

export const projectListComponent = {
    template: require('./project-list.component.html'),
    bindings: {
        projects: '=',
        onDeleted: '&',
        onUpdated: '&'
    },
    controller: ProjectListComponent,
    controllerAs: 'vm'
};
