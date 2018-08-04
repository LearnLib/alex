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

import remove from 'lodash/remove';
import {Project} from '../entities/project';

export class ProjectService {

    /**
     * Constructor.
     *
     * @param {Object} $uibModal
     * @param {LearnerResource} LearnerResource
     * @param {ToastService} ToastService
     * @param {ProjectResource} ProjectResource
     */
    // @ngInject
    constructor($uibModal, LearnerResource, ToastService, ProjectResource) {
        this.$uibModal = $uibModal;
        this.learnerResource = LearnerResource;
        this.toastService = ToastService;
        this.projectResource = ProjectResource;

        /**
         * Project store.
         *
         * @type {{currentProject: ?Project}}
         */
        this.store = {
            currentProject: null,
            projects: []
        };

        // load the project from the session
        const projectInSession = sessionStorage.getItem('project');
        if (projectInSession != null) {
            this.store.currentProject = new Project(JSON.parse(projectInSession));
        }
    }

    load() {
        return this.projectResource.getAll()
            .then(projects => {
                this.store.projects = projects;
                return projects;
            });
    }

    /**
     * Updates a project.
     *
     * @param {Project} project The project to update.
     * @return {Promise<any>} The promise with the updated project on success.
     */
    update(project) {
        return this.learnerResource.getStatus(project.id)
            .then(status => {
                if (status.active && status.project === project.id) {
                    this.toastService.info('You cannot edit this project because a learning process is still active.');
                } else {
                    return this.$uibModal.open({
                        component: 'projectEditModal',
                        resolve: {
                            project: () => new Project(JSON.parse(JSON.stringify(project)))
                        }
                    }).result.then(updatedProject => {
                        const i = this.store.projects.findIndex(p => p.id === updatedProject.id);
                        if (i > -1) this.store.projects[i] = updatedProject;
                        return updatedProject;
                    });
                }
            });
    }

    /**
     * Creates a new project.
     *
     * @param {Project} project The project to create.
     * @return {Promise<any>}
     */
    create(project) {
        return this.projectResource.create(project)
            .then(createdProject => {
                this.store.projects.push(createdProject);
                return createdProject;
            });
    }

    /**
     * Deletes a project.
     *
     * @param {Project} project The project to delete.
     * @return {Promise<any>}
     */
    delete(project) {
        return this.projectResource.remove(project)
            .then(() => {
                remove(this.store.projects, {id: project.id});
                return project;
            });
    }

    /**
     * Saves a project in the current session.
     *
     * @param {Project} project The project to.
     */
    open(project) {
        sessionStorage.setItem('project', JSON.stringify(project));
        this.store.currentProject = project;
    }

    /**
     * Removes the current project from the session.
     */
    close() {
        sessionStorage.removeItem('project');
        this.store.currentProject = null;
    }

    reset() {
        this.close();
        this.store.projects = [];
    }
}
