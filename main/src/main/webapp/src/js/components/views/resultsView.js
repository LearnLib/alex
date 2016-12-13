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

import _ from "lodash";

/**
 * The controller for listing all final test results.
 */
class ResultsView {

    /**
     * Constructor.
     *
     * @param $state
     * @param {SessionService} SessionService
     * @param {LearnResultResource} LearnResultResource
     * @param {PromptService} PromptService
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor($state, SessionService, LearnResultResource, PromptService, ToastService) {
        this.$state = $state;
        this.PromptService = PromptService;
        this.ToastService = ToastService;
        this.LearnResultResource = LearnResultResource;

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * All final test results of a project.
         * @type {LearnResult[]}
         */
        this.results = [];

        /**
         * The test results the user selected.
         * @type {LearnResult[]}
         */
        this.selectedResults = [];

        // get all final test results
        this.LearnResultResource.getAll(this.project.id)
            .then(results => {
                this.results = results;
            })
            .catch(err => console.log(err));
    }

    /**
     * Deletes a test result from the server after prompting the user for confirmation.
     *
     * @param {LearnResult} result - The test result that should be deleted.
     */
    deleteResult(result) {
        this.PromptService.confirm("Do you want to permanently delete this result? Changes cannot be undone.")
            .then(() => {
                this.LearnResultResource.remove(result)
                    .then(() => {
                        this.ToastService.success('Learn result for test <strong>' + result.testNo + '</strong> deleted');
                        _.remove(this.results, {testNo: result.testNo});
                    })
                    .catch(response => {
                        this.ToastService.danger('<p><strong>Result deletion failed</strong></p>' + response.data.message);
                    });
            });
    }

    /**
     * Deletes selected test results from the server after prompting the user for confirmation.
     */
    deleteResults() {
        if (this.selectedResults.length > 0) {
            this.PromptService.confirm("Do you want to permanently delete theses results? Changes cannot be undone.")
                .then(() => {
                    this.LearnResultResource.removeMany(this.selectedResults)
                        .then(() => {
                            this.ToastService.success('Learn results deleted');
                            this.selectedResults.forEach(result => {
                                _.remove(this.results, {testNo: result.testNo});
                            });
                        })
                        .catch(response => {
                            this.ToastService.danger('<p><strong>Result deletion failed</strong></p>' + response.data.message);
                        });
                });
        } else {
            this.ToastService.info('You have to select a least one result');
        }
    }

    /**
     * Opens the learning result compare view with the selected results opened.
     */
    openSelectedResults() {
        if (this.selectedResults.length > 0) {
            const testNos = this.selectedResults.map(r => r.testNo);
            this.$state.go('resultsCompare', {testNos: testNos.join(',')});
        }
    }
}

export const resultsView = {
    controller: ResultsView,
    controllerAs: 'vm',
    templateUrl: 'html/components/views/results.html'
};
