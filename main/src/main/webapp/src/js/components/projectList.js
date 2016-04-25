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

import {events} from '../constants';

/**
 * The directive that displays a list of projects.
 *
 * Usage: <project-list projects="..."></project-list> where property 'projects' expects an array of projects.
 */
// @ngInject
class ProjectList {

    /**
     * Constructor
     * @param $state
     * @param {ProjectResource} ProjectResource
     * @param {SymbolGroupResource} SymbolGroupResource
     * @param {ToastService} ToastService
     * @param {SessionService} SessionService
     * @param {PromptService} PromptService
     * @param {EventBus} EventBus
     * @param {DownloadService} DownloadService
     */
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
     * Save a project into the sessionStorage and redirect to its dashboard
     * @param {Project} project - The project to work on
     */
    openProject(project) {
        this.SessionService.saveProject(project);
        this.EventBus.emit(events.PROJECT_OPENED, {project: project});
        this.$state.go('projectsDashboard');
    }

    /**
     * Deletes a project
     * @param {Project} project - The project to delete
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
     * @param {Project} project
     */
    exportProject(project) {
        this.ProjectResource.get(project.id).then(project => {
            this.SymbolGroupResource.getAll(project.id, true).then(groups => {
                groups.forEach(group => {
                    delete group.id;
                    delete group.project;
                    delete group.user;

                    group.symbols = group.symbols.map(symbol => symbol.getExportableSymbol())
                });

                delete project.id;
                delete project.user;
                project.defaultGroup = groups.shift();
                project.groups = groups;

                this.PromptService.prompt("Enter a filename for the project").then(filename => {
                    this.DownloadService.downloadObject(project, filename);
                    this.ToastService.success('The project has been exported.');
                });
            })
        })
    }
}

const projectList = {
    bindings: {
        projects: '='
    },
    controller: ProjectList,
    controllerAs: 'vm',
    template: `
        <div class="project-list">
            <div class="project-list-item" ng-if="vm.projects.length > 0" ng-repeat="project in vm.projects">
                <div class="btn-group btn-group-xs pull-right" uib-dropdown>
                    <button type="button" class="btn btn-default btn-icon dropdown-toggle" uib-dropdown-toggle dropdown-hover>
                        <i class="fa fa-bars"></i>
                    </button>
                    <ul uib-dropdown-menu class="dropdown-menu pull-left" role="menu">
                        <li>
                            <a href="" ng-click="vm.openProject(project)">
                                <i class="fa fa-fw fa-external-link"></i> Open
                            </a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <a href="" project-settings-modal-handle project="project">
                                <i class="fa fa-edit fa-fw"></i> Edit
                            </a>
                        </li>
                        <li>
                            <a href="" ng-click="vm.deleteProject(project)">
                                <i class="fa fa-trash fa-fw"></i> Delete
                            </a>
                        </li>
                        <li>
                            <a href="" ng-click="vm.exportProject(project)">
                                <i class="fa fa-download fa-fw"></i> Export
                            </a>
                        </li>
                    </ul>
                </div>
                <h3 class="list-group-item-heading">
                    <a href="" ng-bind="project.name" ng-click="vm.openProject(project)"></a>
                </h3>
                <p class="list-group-item-text">
                    <span ng-bind="project.baseUrl"></span> <br>
                    <span class="text-muted" ng-if="!project.description">There is no description for this project</span>
                    <span class="text-muted" ng-if="project.description" ng-bind="project.description"></span>
                </p>
            </div>
            <div class="alert alert-info" ng-if="vm.projects.length == 0">
                You haven't created a project yet.
            </div>
        </div>
    `
};

export default projectList;