(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsStatisticsController', LearnResultsStatisticsController);

    LearnResultsStatisticsController.$inject = [
        '$scope', 'SessionService', 'LearnResultResource', 'SelectionService', 'LearnerResultChartService'
    ];

    /**
     *
     *
     * The corresponding template can be found under 'views/pages/learn-results-statistics.html'.
     *
     * @param $scope
     * @param Session
     * @param LearnResultResource
     * @param SelectionService
     * @param LearnerResultChartService
     * @constructor
     */
    function LearnResultsStatisticsController($scope, Session, LearnResultResource, SelectionService,
                                              LearnerResultChartService) {

        // The project that is stored in the session
        var project = Session.project.get();

        /**
         * The enum that indicates which kind of chart should be displayed
         * @type {{MULTIPLE_FINAL: number, MULTIPLE_COMPLETE: number}}
         */
        $scope.chartModes = {
            MULTIPLE_FINAL: 0,
            MULTIPLE_COMPLETE: 1
        };

        /**
         * The map that indicated from which property of a Learner Result a chart should be created
         * @type {{RESETS: string, SYMBOLS: string, DURATION: string}}
         */
        $scope.chartProperties = LearnerResultChartService.properties;

        /**
         * All final Learn Results from the project
         * @type {Array}
         */
        $scope.results = [];

        /**
         * The mode of the displayed chart
         * @type {null|number}
         */
        $scope.selectedChartMode = null;

        /**
         * The property of a learner result that is displayed in the chart
         * @type {string}
         */
        $scope.selectedChartProperty = $scope.chartProperties.RESETS;

        /**
         * @type {boolean}
         */
        $scope.fullWidth = false;

        /**
         * The n3 chart data for the directive
         * @type {{data: null|Array, options: null|{}}}
         */
        $scope.chartData = {
            data: null,
            options: null
        };

        // get all final learn results of the project
        LearnResultResource.getAllFinal(project.id)
            .then(function (results) {
                $scope.results = results;
            });

        /**
         * Sets the selected learner result property from which the chart data should be created. Calls the methods
         * to create the chart data based on the selected chart mode.
         *
         * @param property - The learner result property
         */
        $scope.selectChartProperty = function (property) {
            $scope.selectedChartProperty = property;
            if ($scope.selectedChartMode === $scope.chartModes.MULTIPLE_FINAL) {
                $scope.createChartFromFinalResults();
            } else if ($scope.selectedChartMode === $scope.chartModes.MULTIPLE_COMPLETE) {
                $scope.createChartFromCompleteResults();
            }
        };

        /**
         * Creates n3 line chart data from the selected final learner results and saves it into the scope. Sets the
         * displayable chart mode to MULTIPLE_FINAL
         */
        $scope.createChartFromFinalResults = function () {
            var selectedResults = SelectionService.getSelected($scope.results);
            var chartData;

            if (selectedResults.length > 0) {
                chartData =
                    LearnerResultChartService
                        .createDataFromMultipleFinalResults(selectedResults, $scope.selectedChartProperty);

                $scope.chartData = {
                    data: chartData.data,
                    options: chartData.options
                };

                $scope.selectedChartMode = $scope.chartModes.MULTIPLE_FINAL;
            }
        };

        /**
         * Creates n3 area chart data from the selected learner results. Therefore makes an API request to fetch the
         * complete data from each selected learner result and saves the chart data into the scope. Sets the
         * displayable chart mode to MULTIPLE_COMPLETE
         */
        $scope.createChartFromCompleteResults = function () {
            var selectedResults = SelectionService.getSelected($scope.results);
            var chartData;

            if (selectedResults.length > 0) {

                // TODO: dummy values, fill with data from the server
                var selectedResults = [];
                selectedResults.push([$scope.results[0], $scope.results[1]]);
                selectedResults.push([$scope.results[2], $scope.results[0], $scope.results[1]]);
                selectedResults.push([$scope.results[1], $scope.results[2]]);

                chartData =
                    LearnerResultChartService
                        .createDataFromMultipleCompleteResults(selectedResults, $scope.selectedChartProperty);

                $scope.chartData = {
                    data: chartData.data,
                    options: chartData.options
                };

                $scope.selectedChartMode = $scope.chartModes.MULTIPLE_COMPLETE;
            }
        };

        /**
         * Resets the chart data and removes the selected chart mode so that the chart disappears and the list of
         * learner results will be shown again
         */
        $scope.back = function () {
            $scope.selectedChartMode = null;
            $scope.chartData = {
                data: null,
                options: null
            };
            $scope.fullWidth = false;
        }
    }
}());