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

import {events} from "../constants";

/**
 * The directive that displays a list of projects.
 *
 * Usage: <project-list projects="..."></project-list> where property 'projects' expects an array of projects.
 */
class ProjectList {

    /**
     * Constructor.
     *
     * @param $state
     * @param {ProjectResource} ProjectResource
     * @param {SymbolGroupResource} SymbolGroupResource
     * @param {ToastService} ToastService
     * @param {SessionService} SessionService
     * @param {PromptService} PromptService
     * @param {EventBus} EventBus
     * @param {DownloadService} DownloadService
     */
    // @ngInject
    constructor($state, ProjectResource, SymbolGroupResource, ToastService, SessionService, PromptService, EventBus,
                DownloadService) {
        this.$state = $state;
        this.ProjectResource = ProjectResource;
        this.SymbolGroupResource = SymbolGroupResource;
        this.ToastService = ToastService;
        this.SessionService = SessionService;
        this.PromptService = PromptService;
        this.EventBus = EventBus;
        this.DownloadService = DownloadService;
    }

    /**
     * Save a project into the sessionStorage and redirect to its dashboard.
     *
     * @param {Project} project - The project to work on.
     */
    openProject(project) {
        this.SessionService.saveProject(project);
        this.EventBus.emit(events.PROJECT_OPENED, {project: project});
        this.$state.go('projectsDashboard');
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

    /**
     * Downloads the project in an importable format.
     *
     * @param {Project} project.
     */
    exportProject(project) {
        this.ProjectResource.getForExport(project.id)
            .then(p => {
                delete p.id;
                delete p.user;

                delete p.counters;
                delete p.testResults;
                delete p.symbolAmount;

                this.prepareGroupForExport(p.defaultGroup);

                p.groups.forEach(group => {
                    this.prepareGroupForExport(group);
                });

                this.PromptService.prompt("Enter a filename for the project").then(filename => {
                    this.DownloadService.downloadObject(p, filename);
                    this.ToastService.success('The project has been exported.');
                });
            });
    }

    prepareGroupForExport(group) {
        delete group.id;
        delete group.project;
        delete group.user;
        delete group.symbolAmount;

        group.symbols.forEach(symbol => {
            delete symbol.user;
            delete symbol.project;
            delete symbol.group;
            delete symbol.id;
            delete symbol.hidden;

            symbol.actions.forEach(action => {
                delete action.symbolToExecuteName;
            });
        });
    }

}

export const projectList = {
    templateUrl: 'html/components/project-list.html',
    templateUrl: 'html/components/project-list.html',
    bindings: {
        projects: '='
    },
    controller: ProjectList,
    controllerAs: 'vm'
};