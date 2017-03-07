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
 * The controller for the modal that displays a selectable list of results.
 */
export class ResultListModalComponent {

    /**
     * Constructor.
     *
     * @param {EventBus} EventBus
     * @param {ProjectResource} ProjectResource
     * @param {LearnResultResource} LearnResultResource
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(EventBus, ProjectResource, LearnResultResource, ToastService) {
        this.EventBus = EventBus;
        this.LearnResultResource = LearnResultResource;
        this.ToastService = ToastService;

        /**
         * The projects.
         * @type {Project[]}
         */
        this.projects = [];

        /**
         * The results of the current project.
         * @type {LearnResult[]}
         */
        this.results = null;

        ProjectResource.getAll()
            .then(projects => this.projects = projects)
            .catch(err => console.log(err));
    }

    $onInit() {
        this.results = this.resolve.modalData.results;
    }

    /** Switches the view. */
    switchProject() {
        this.results = null;
    }

    /**
     * Selects a project of which the learn results should be displayed.
     * @param {Project} project
     */
    selectProject(project) {
        this.LearnResultResource.getAll(project.id)
            .then(results => this.results = results)
            .catch(err => console.log(err));
    }

    /**
     * Emits the selected result and closes the modal.
     * @param {LearnResult} result
     */
    selectResult(result) {
        this.EventBus.emit(events.RESULT_SELECTED, {result: result});
        this.dismiss();
    }

    /**
     * Loads a hypothesis from a json file.
     * @param {string} hypothesis - The hypothesis as string
     */
    loadResultFromFile(hypothesis) {
        try {
            this.EventBus.emit(events.RESULT_SELECTED, {
                result: {
                    steps: [{hypothesis: JSON.parse(hypothesis)}]
                }
            });
            this.dismiss();
        } catch (e) {
            this.ToastService.danger('Could not parse the file.')
        }
    }
}


export const resultListModalComponent = {
    templateUrl: 'html/components/modals/result-list-modal.html',
    bindings: {
        dismiss: '&',
        resolve: '='
    },
    controller: ResultListModalComponent,
    controllerAs: 'vm',
};


// @ngInject
export function resultListModalHandle($uibModal) {
    return {
        scope: {
            results: '='
        },
        restrict: 'A',
        link(scope, el) {
            el.on('click', () => {
                $uibModal.open({
                    component: 'resultListModal',
                    resolve: {
                        modalData: function () {
                            return {results: scope.results};
                        }
                    }
                });
            });
        }
    };
}