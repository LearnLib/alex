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
 * The directive for the dashboard widget that displays information about the current project.
 */
class ProjectDetailsWidget {

    /**
     * Constructor.
     *
     * @param $scope
     * @param {SessionService} SessionService
     * @param {SymbolGroupResource} SymbolGroupResource
     * @param {LearnResultResource} LearnResultResource
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor($scope, SessionService, SymbolGroupResource, LearnResultResource, EventBus) {

        /**
         * The project in sessionStorage.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The number of symbol groups of the project.
         * @type {null|number}
         */
        this.numberOfGroups = null;

        /**
         * The number of visible symbols of the project.
         * @type {null|number}
         */
        this.numberOfSymbols = null;

        /**
         * The number of persisted test runs in the database.
         * @type {null|number}
         */
        this.numberOfTests = null;

        SymbolGroupResource.getAll(this.project.id, true)
            .then(groups => {
                this.numberOfGroups = groups.length;
                let counter = 0;
                groups.forEach(g => counter += g.symbols.length);
                this.numberOfSymbols = counter;
            })
            .catch(err => console.log(err));

        LearnResultResource.getAll(this.project.id)
            .then(results => {
                this.numberOfTests = results.length;
            })
            .catch(err => console.log(err));

        // listen on project update event
        EventBus.on(events.PROJECT_UPDATED, (evt, data) => {
            this.project = data.project;
            SessionService.saveProject(data.project);
        }, $scope);
    }
}

export const projectDetailsWidget = {
    controller: ProjectDetailsWidget,
    controllerAs: 'vm',
    template: `
        <widget title="Project details">
            <table class="table table-condensed">
                <tbody>
                <tr>
                    <td><strong>Name</strong></td>
                    <td ng-bind="vm.project.name"></td>
                </tr>
                <tr>
                    <td><strong>URL</strong></td>
                    <td><a href="{{vm.project.baseUrl}}" target="_blank" ng-bind="vm.project.baseUrl"></a></td>
                </tr>
                <tr> 
                    <td><strong>Mirrors</strong></td> 
                    <td ng-bind="vm.project.mirrorUrls.length"></td> 
                </tr> 
                <tr>
                    <td><strong>#Groups</strong></td>
                    <td ng-bind="vm.numberOfGroups"></td>
                </tr>
                <tr>
                    <td><strong>#Symbols</strong></td>
                    <td ng-bind="vm.numberOfSymbols"></td>
                </tr>
                <tr>
                    <td><strong>#Tests</strong></td>
                    <td ng-bind="vm.numberOfTests"></td>
                </tr>
                </tbody>
            </table>
            <button class="btn btn-default btn-xs" project-settings-modal-handle project="vm.project">
                <i class="fa fa-fw fa-edit"></i> Edit project
            </button>
        </widget>
    `
};