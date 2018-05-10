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
import {Selectable} from '../../../utils/selectable';

/**
 * The controller for listing all final test results.
 */
class ResultsViewComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param {SessionService} SessionService
     * @param {LearnResultResource} LearnResultResource
     * @param {PromptService} PromptService
     * @param {ToastService} ToastService
     * @param {LearnerResultDownloadService} LearnerResultDownloadService
     */
    // @ngInject
    constructor($state, SessionService, LearnResultResource, PromptService, ToastService,
                LearnerResultDownloadService) {
        this.$state = $state;
        this.PromptService = PromptService;
        this.ToastService = ToastService;
        this.LearnResultResource = LearnResultResource;
        this.LearnerResultDownloadService = LearnerResultDownloadService;

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
         * @type {Selectable}
         */
        this.selectedResults = new Selectable(this.results, 'testNo');

        // get all final test results
        this.LearnResultResource.getAll(this.project.id)
            .then(results => {
                this.results = results;
                this.selectedResults = new Selectable(this.results, 'testNo');
            })
            .catch(err => console.log(err));
    }

    /**
     * Deletes a test result from the server after prompting the user for confirmation.
     *
     * @param {LearnResult} result - The test result that should be deleted.
     */
    deleteResult(result) {
        this.PromptService.confirm('Do you want to permanently delete this result? Changes cannot be undone.')
            .then(() => {
                this.LearnResultResource.remove(result)
                    .then(() => {
                        this.ToastService.success('Learn result for test <strong>' + result.testNo + '</strong> deleted');
                        remove(this.results, {testNo: result.testNo});
                        this.selectedResults.unselect(result);
                    })
                    .catch(err => {
                        this.ToastService.danger('<p><strong>Result deletion failed</strong></p>' + err.data.message);
                    });
            });
    }

    /**
     * Deletes selected test results from the server after prompting the user for confirmation.
     */
    deleteResults() {
        const selectedResults = this.selectedResults.getSelected();
        if (selectedResults.length > 0) {
            this.PromptService.confirm('Do you want to permanently delete theses results? Changes cannot be undone.')
                .then(() => {
                    this.LearnResultResource.removeMany(selectedResults)
                        .then(() => {
                            this.ToastService.success('Learn results deleted');
                            selectedResults.forEach(result => remove(this.results, {testNo: result.testNo}));
                            this.selectedResults.unselectAll();
                        })
                        .catch(err => {
                            this.ToastService.danger('<p><strong>Result deletion failed</strong></p>' + err.data.message);
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
        const selectedResults = this.selectedResults.getSelected();
        if (selectedResults.length > 0) {
            const testNos = selectedResults.map(r => r.testNo).join(',');
            this.$state.go('learnerResultsCompare', {testNos, projectId: this.project.id});
        }
    }

    /**
     * Redirect to the statistics page for the selected results.
     */
    showSelectedStatistics() {
        const selectedResults = this.selectedResults.getSelected();
        const testNos = selectedResults.map(r => r.testNo).join(',');
        this.$state.go('learnerResultsStatistics', {testNos, projectId: this.project.id});
    }

    showStatistics(result) {
        this.$state.go('learnerResultsStatistics', {testNos: '' + result.testNo, projectId: this.project.id});
    }

    /**
     * Exports the statistics and some other attributes from a given learn result into csv.
     *
     * @param {LearnResult} result - The learn result to download as csv.
     */
    exportAsCSV(result) {
        this.LearnerResultDownloadService.download([result])
            .then(() => this.ToastService.success('The result has been exported.'));
    }

    /**
     * Exports selected learn results into a csv file.
     */
    exportSelectedAsCSV() {
        const selectedResults = this.selectedResults.getSelected();
        if (selectedResults.length > 0) {
            this.LearnerResultDownloadService.download(selectedResults)
                .then(() => this.ToastService.success('The results have been exported.'));
        }
    }
}

export const resultsViewComponent = {
    controller: ResultsViewComponent,
    controllerAs: 'vm',
    template: require('./learner-results-view.component.html')
};
