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
 * The controller for the modal that displays a selectable list of results.
 */
export class ResultListModalComponent {

    /**
     * Constructor.
     *
     * @param {ProjectService} ProjectService
     * @param {LearnResultResource} LearnResultResource
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(ProjectService, LearnResultResource, ToastService) {
        this.LearnResultResource = LearnResultResource;
        this.ToastService = ToastService;
        this.ProjectService = ProjectService;

        /**
         * The results of the current project.
         * @type {LearnResult[]}
         */
        this.results = null;

        ProjectService.load();
    }

    $onInit() {
        this.results = this.resolve.results;
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
        this.close({$value: result});
    }

    /**
     * Loads a hypothesis from a json file.
     * @param {string} hypothesis - The hypothesis as string
     */
    loadResultFromFile(hypothesis) {
        try {
            this.close({$value: {steps: [{hypothesis: JSON.parse(hypothesis)}]}});
        } catch (e) {
            this.ToastService.danger('Could not parse the file.');
        }
    }

    get projects() {
        return this.ProjectService.store.projects;
    }
}

export const resultListModalComponent = {
    template: require('./learner-result-list-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controller: ResultListModalComponent,
    controllerAs: 'vm',
};
