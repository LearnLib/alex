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

/**
 * The controller for the learn statistics page.
 */
class StatisticsCompareView {

    /**
     * Constructor.
     * @param {SessionService} SessionService
     * @param {LearnResultResource} LearnResultResource
     * @param {LearnerResultChartService} LearnerResultChartService
     * @param {ToastService} ToastService
     * @param $stateParams
     * @param $state
     * @param {DownloadService} DownloadService
     * @param {PromptService} PromptService
     */
    // @ngInject
    constructor(SessionService, LearnResultResource, LearnerResultChartService, ToastService, $stateParams, $state,
                DownloadService, PromptService) {

        this.LearnResultResource = LearnResultResource;
        this.LearnerResultChartService = LearnerResultChartService;
        this.ToastService = ToastService;
        this.$stateParams = $stateParams;
        this.$state = $state;
        this.DownloadService = DownloadService;
        this.PromptService = PromptService;

        // make sure there is at least one test number given in the URL
        if (!$stateParams.testNos || $stateParams.testNos === '') {
            this.ToastService.danger('You have to select at least one result');
            this.$state.go('statistics');
            return;
        }

        // make sure the mode if acceptable
        if ($stateParams.mode !== chartMode.CUMULATED
            && $stateParams.mode !== chartMode.COMPLETE) {

            this.ToastService.danger('The chart mode should be cumulated or complete');
            this.$state.go('statistics');
            return;
        }

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The list of test result nos that are used for the chart
         * @type{number[]}
         */
        this.testNos = $stateParams.testNos.split(',').map(t => Number.parseInt(t));

        /**
         * Make the chart mode dictionary available in the view
         * @type {object}
         */
        this.chartMode = chartMode;

        /**
         * The data to fill the charts
         * @type {object}
         */
        this.chartData = {};

        /**
         * The selected chart mode
         * @type {string}
         */
        this.selectedChartMode = $stateParams.mode;

        /**
         * If the charts should be shown in two columns
         * @type {boolean}
         */
        this.showInColumns = true;

        // depending on the mode, create a different chart
        if (this.selectedChartMode === chartMode.CUMULATED) {
            if (this.testNos.length === 1) {
                this.createChartSingleFinal(this.testNos[0]);
            } else {
                this.createChartMultipleFinal(this.testNos);
            }
        } else {
            if (this.testNos.length === 1) {
                this.createChartSingleComplete(this.testNos[0]);
            } else {
                this.createChartMultipleComplete(this.testNos);
            }
        }
    }

    /**
     * @param {number} testNo
     */
    createChartSingleFinal(testNo) {
        this.LearnResultResource.get(this.project.id, testNo)
            .then(result => {
                this.chartData = this.LearnerResultChartService.createDataSingleFinal(result);
            });
    }

    /**
     * @param {number} testNo
     */
    createChartSingleComplete(testNo) {
        this.LearnResultResource.get(this.project.id, testNo)
            .then(result => {
                this.chartData = this.LearnerResultChartService.createDataSingleComplete(result);
            });
    }

    /**
     * @param {number[]} testNos
     */
    createChartMultipleFinal(testNos) {
        this.LearnResultResource.getAll(this.project.id).then(results => {

            // get all results and filter because there is still no other api endpoint
            const resultsFromTestNos = results.filter(r => testNos.indexOf(r.testNo) > -1);
            this.chartData = this.LearnerResultChartService.createDataMultipleFinal(resultsFromTestNos);
        });
    }

    /**
     * @param {number[]} testNos
     */
    createChartMultipleComplete(testNos) {
        this.LearnResultResource.getAll(this.project.id).then(results => {

            // get all results and filter because there is still no other api endpoint
            const resultsFromTestNos = results.filter(r => testNos.indexOf(r.testNo) > -1);
            this.chartData = this.LearnerResultChartService.createDataMultipleComplete(resultsFromTestNos);
        });
    }

    switchToFinal() {
        if (this.selectedChartMode === chartMode.COMPLETE) {
            this.$state.go('statisticsCompare', {
                testNos: this.testNos.join(','),
                mode: chartMode.CUMULATED
            });
        } else {
            this.ToastService.info('You are already in the cumulated mode');
        }
    }

    switchToComplete() {
        if (this.selectedChartMode === chartMode.CUMULATED) {
            this.$state.go('statisticsCompare', {
                testNos: this.testNos.join(','),
                mode: chartMode.COMPLETE
            });
        } else {
            this.ToastService.info('You are already in the complete mode');
        }
    }

    toggleShowInColumns() {
        this.showInColumns = !this.showInColumns;

        // adjust the size of the charts
        window.setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }

    downloadChart(selector) {
        this.PromptService.prompt("Enter a name for the svg file")
            .then(filename => {
                this.DownloadService.downloadSvg(selector, false, filename);
            });
    }
}

export const statisticsCompareView = {
    controller: StatisticsCompareView,
    controllerAs: 'vm',
    templateUrl: 'html/components/views/statistics-compare.html'
};