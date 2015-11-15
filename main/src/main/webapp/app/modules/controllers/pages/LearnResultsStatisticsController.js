/**
 * The controller for the learn result statistics page.
 *
 * @param $scope - The controllers scope
 * @param SessionService - The SessionService
 * @param LearnResultResource - The API resource for learn results
 * @param LearnerResultChartService
 * @constructor
 */
// @ngInject
class LearnResultsStatisticsController {

    /**
     * Constructor
     * @param SessionService
     * @param LearnResultResource
     * @param LearnerResultChartService
     */
    constructor(SessionService, LearnResultResource, LearnerResultChartService) {
        this.LearnResultResource = LearnResultResource;
        this.LearnerResultChartService = LearnerResultChartService;

        /**
         * The project that is in the session
         * @type {Project}
         */
        this.project = SessionService.project.get();

        /**
         * The enum that indicates which kind of chart should be displayed
         * @type {{MULTIPLE_FINAL: number, MULTIPLE_COMPLETE: number}}
         */
        this.chartModes = {
            MULTIPLE_FINAL: 0,
            MULTIPLE_COMPLETE: 1
        };

        /**
         * The map that indicated from which property of a Learner Result a chart should be created
         * @type {{RESETS: string, SYMBOLS: string, DURATION: string}}
         */
        this.chartProperties = this.LearnerResultChartService.properties;

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

        /**
         * The mode of the displayed chart
         * @type {null|number}
         */
        this.selectedChartMode = null;

        /**
         * The property of a learner result that is displayed in the chart
         * @type {string}
         */
        this.selectedChartProperty = this.chartProperties.MQS;

        /**
         * @type {boolean}
         */
        this.fullWidth = false;

        /**
         * The n3 chart data for the directive
         * @type {{data: null|Array, options: null|{}}}
         */
        this.chartData = {
            data: null,
            options: null
        };

        // get all final learn results of the project
        this.LearnResultResource.getAllFinal(this.project.id).then(results => {
            this.results = results;
        });
    }

    /**
     * Sets the selected learner result property from which the chart data should be created. Calls the methods
     * to create the chart data based on the selected chart mode.
     *
     * @param {number} property - The learner result property
     */
    selectChartProperty(property) {
        this.selectedChartProperty = property;
        if (this.selectedChartMode === this.chartModes.MULTIPLE_FINAL) {
            this.createChartFromFinalResults();
        } else if (this.selectedChartMode === this.chartModes.MULTIPLE_COMPLETE) {
            this.createChartFromCompleteResults();
        }
    }

    /**
     * Creates n3 line chart data from the selected final learner results and saves it into the scope. Sets the
     * displayable chart mode to MULTIPLE_FINAL
     */
    createChartFromFinalResults() {
        if (this.selectedResults.length > 0) {
            const chartData = this.LearnerResultChartService
                .createDataFromMultipleFinalResults(this.selectedResults, this.selectedChartProperty);

            this.chartData = {
                data: chartData.data,
                options: chartData.options
            };

            this.selectedChartMode = this.chartModes.MULTIPLE_FINAL;
        }
    }

    /**
     * Creates n3 area chart data from the selected learner results. Therefore makes an API request to fetch the
     * complete data from each selected learner result and saves the chart data into the scope. Sets the
     * displayable chart mode to MULTIPLE_COMPLETE
     */
    createChartFromCompleteResults() {
        if (this.selectedResults.length > 0) {
            this.LearnResultResource.getManyComplete(this.project.id, this.selectedResults.map(r => r.testNo))
                .then(completeResults => {
                    const chartData = this.LearnerResultChartService
                        .createDataFromMultipleCompleteResults(completeResults, this.selectedChartProperty);

                    this.chartData = {
                        data: chartData.data,
                        options: chartData.options
                    };

                    this.selectedChartMode = this.chartModes.MULTIPLE_COMPLETE;
                })
        }
    }

    /**
     * Resets the chart data and removes the selected chart mode so that the chart disappears and the list of
     * learner results will be shown again
     */
    back() {
        this.selectedChartMode = null;
        this.chartData = {
            data: null,
            options: null
        };
        this.fullWidth = false;
    }
}

export default LearnResultsStatisticsController;