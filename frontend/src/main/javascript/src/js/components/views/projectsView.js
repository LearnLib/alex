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

import {events} from "../../constants";

/**
 * The controller that shows the page to manage projects.
 */
class ProjectsView {

    /**
     * Constructor.
     *
     * @param $scope
     * @param $state
     * @param {SessionService} SessionService
     * @param {ProjectResource} ProjectResource
     * @param {EventBus} EventBus
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor($scope, $state, SessionService, ProjectResource, EventBus, ToastService) {

        /**
         * The list of all projects.
         * @type {Project[]}
         */
        this.projects = [];

        // go to the dashboard if there is a project in the session
        if (SessionService.getProject() !== null) {
            $state.go('projectsDashboard');
            return;
        }

        //get all projects from the server
        ProjectResource.getAll()
            .then(projects => {
                this.projects = projects;
            })
            .catch(response => {
                ToastService.danger(`Loading project failed. ${response.data.message}`);
            });

        // listen on project create event
        EventBus.on(events.PROJECT_CREATED, (evt, data) => {
            this.projects.push(data.project);
        }, $scope);

        // listen on project update event
        EventBus.on(events.PROJECT_UPDATED, (evt, data) => {
            const project = data.project;
            const i = this.projects.findIndex(p => p.id === project.id);
            if (i > -1) this.projects[i] = project;
        }, $scope);

        // listen on project delete event
        EventBus.on(events.PROJECT_DELETED, (evt, data) => {
            const i = this.projects.findIndex(p => p.id === data.project.id);
            if (i > -1) this.projects.splice(i, 1);
        }, $scope);
    }
}

export const projectsView = {
    controller: ProjectsView,
    controllerAs: 'vm',
    templateUrl: 'html/components/views/projects-view.html'
};