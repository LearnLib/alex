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

/**
 * The controller for the learn statistics page.
 */
class StatisticsCompareView {

    /**
     * Constructor.
     *
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

        /**
         * The available chart display modes.
         * @type {any}
         */
        this.chartModes = {
            SINGLE_FINAL: 0,
            SINGLE_COMPLETE: 1,
            MULTIPLE_FINAL: 2,
            MULTIPLE_COMPLETE: 3
        };

        /**
         * The project that is in the session.
         * @type {Project}
         */
        this.project = SessionService.getProject();

        /**
         * The list of test result nos that are used for the chart.
         * @type{number[]}
         */
        this.testNos = $stateParams.testNos.split(',').map(t => Number.parseInt(t));

        /**
         * Make the chart mode dictionary available in the view.
         * Per default, display the cumulated charts.
         * @type {number}
         */
        this.chartMode = this.testNos.length > 1 ? this.chartModes.MULTIPLE_FINAL : this.chartModes.SINGLE_FINAL;

        /**
         * The data to fill the charts.
         * @type {object}
         */
        this.chartData = {};

        /**
         * If the charts should be shown in two columns.
         * @type {boolean}
         */
        this.showInColumns = true;

        // create the charts
        this.createChartData();
    }

    /**
     * Create chart data for the given mode and learn results.
     */
    createChartData() {
        switch (this.chartMode) {
            case this.chartModes.SINGLE_FINAL:
                this.LearnResultResource.get(this.project.id, this.testNos[0])
                    .then(result => {
                        this.chartData = this.LearnerResultChartService.createDataSingleFinal(result);
                    });
                break;
            case this.chartModes.SINGLE_COMPLETE:
                this.LearnResultResource.get(this.project.id, this.testNos[0])
                    .then(result => {
                        this.chartData = this.LearnerResultChartService.createDataSingleComplete(result);
                    });
                break;
            case this.chartModes.MULTIPLE_FINAL:
                this.LearnResultResource.getAll(this.project.id).then(results => {

                    // get all results and filter because there is still no other api endpoint
                    const resultsFromTestNos = results.filter(r => this.testNos.indexOf(r.testNo) > -1);
                    this.chartData = this.LearnerResultChartService.createDataMultipleFinal(resultsFromTestNos);
                });
                break;
            case this.chartModes.MULTIPLE_COMPLETE:
                this.LearnResultResource.getAll(this.project.id).then(results => {

                    // get all results and filter because there is still no other api endpoint
                    const resultsFromTestNos = results.filter(r => this.testNos.indexOf(r.testNo) > -1);
                    this.chartData = this.LearnerResultChartService.createDataMultipleComplete(resultsFromTestNos);
                });
                break;
            default:
                break;
        }
    }

    /** Switch the view to final. */
    switchToFinal() {
        switch (this.chartMode) {
            case this.chartModes.SINGLE_COMPLETE:
                this.chartMode = this.chartModes.SINGLE_FINAL;
                break;
            case this.chartModes.MULTIPLE_COMPLETE:
                this.chartMode = this.chartModes.MULTIPLE_FINAL;
                break;
            default:
                break;
        }
        this.createChartData();
    }

    /** Switch the view to complete. */
    switchToComplete() {
        switch (this.chartMode) {
            case this.chartModes.SINGLE_FINAL:
                this.chartMode = this.chartModes.SINGLE_COMPLETE;
                break;
            case this.chartModes.MULTIPLE_FINAL:
                this.chartMode = this.chartModes.MULTIPLE_COMPLETE;
                break;
            default:
                break;
        }
        this.createChartData();
    }

    /** Toggle the layout of the charts. */
    toggleShowInColumns() {
        this.showInColumns = !this.showInColumns;

        // adjust the size of the charts
        window.setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 100);
    }

    /**
     * Download the chart as svg.
     *
     * @param {string} selector - The selector of the svg.
     */
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