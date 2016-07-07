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

import {chartMode} from '../../constants';

/** The controller for the statistics page. */
class StatisticsView {

    /**
     * Constructor
     * @param {SessionService} SessionService
     * @param {LearnResultResource} LearnResultResource
     * @param {ToastService} ToastService
     * @param $state
     * @param {LearnerResultDownloadService} LearnerResultDownloadService
     */
    // @ngInject
    constructor(SessionService, LearnResultResource, ToastService, $state, LearnerResultDownloadService) {
        this.LearnResultResource = LearnResultResource;
        this.ToastService = ToastService;
        this.$state = $state;
        this.LearnerResultDownloadService = LearnerResultDownloadService;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * All final Learn Results from the project
         * @type {LearnResult[]}
         */
        this.results = [];

        /**
         * The list of selected learn results
         * @type {LearnResult[]}
         */
        this.selectedResults = [];

        // get all final learn results of the project
        this.LearnResultResource.getAll(this.project.id)
            .then(results => {
                this.results = results;
            });
    }

    /** Gathers the testNos of selected results and redirects to the compare view */
    createChartSelectedFinalResults() {
        if (this.selectedResults.length > 0) {
            const testNos = this.selectedResults.map(r => r.testNo).join(',');
            this.$state.go('statisticsCompare', {
                testNos: testNos,
                mode: chartMode.CUMULATED
            });
        }
    }

    /** Gathers the testNos of selected results and redirects to the compare view */
    createChartSelectedCompleteResults() {
        if (this.selectedResults.length > 0) {
            const testNos = this.selectedResults.map(r => r.testNo).join(',');
            this.$state.go('statisticsCompare', {
                testNos: testNos,
                mode: chartMode.COMPLETE
            });
        }
    }

    /** Redirects to the compare view */
    createChartCompleteResult(result) {
        this.$state.go('statisticsCompare', {
            testNos: result.testNo,
            mode: chartMode.COMPLETE
        });
    }

    /** Redirects to the compare view */
    createChartFinalResult(result) {
        this.$state.go('statisticsCompare', {
            testNos: result.testNo,
            mode: chartMode.CUMULATED
        });
    }

    /**
     * Exports the statistics and some other attributes from a given learn result into csv
     * @param {LearnResult} result
     */
    exportAsCSV(result) {
        this.LearnerResultDownloadService.download([result]);
        this.ToastService.success('The result has been exported.');
    }

    /** Exports selected learn results into a csv file */
    exportSelectedAsCSV() {
        if (this.selectedResults.length > 0) {
            this.LearnerResultDownloadService.download(this.selectedResults);
            this.ToastService.success('The results have been exported.');
        }
    }
}

export const statisticsView = {
    controller: StatisticsView,
    controllerAs: 'vm',
    templateUrl: 'html/components/views/statistics.html'
};