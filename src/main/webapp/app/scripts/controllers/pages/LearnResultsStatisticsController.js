(function () {
    'use strict';

    angular
        .module('weblearner.controller')
        .controller('LearnResultsStatisticsController', [
            '$scope', 'SessionService', 'LearnResultResource', 'TestResultsChartService', 'SelectionService',
            LearnResultsStatisticsController
        ]);

    /**
     * LearnResultsStatisticsController
     *
     * The controller that is used for the statistics page
     *
     * @param $scope
     * @param SessionService
     * @param LearnResultResource
     * @param TestResultsChartService
     * @param SelectionService
     * @constructor
     */
    function LearnResultsStatisticsController($scope, SessionService, LearnResultResource, TestResultsChartService, SelectionService) {

        /** The open project */
        $scope.project = SessionService.project.get();

        /** The tests of the project @type {Array} */
        $scope.tests = [];

        /** Enum for the kind of chart that will be displayed **/
        $scope.chartModes = {
            SINGLE_COMPLETE_TEST_RESULT: 0,
            MULTIPLE_FINAL_TEST_RESULTS: 1,
            TWO_COMPLETE_TEST_RESULTS: 2
        };

        /** The active mode **/
        $scope.chartMode;

        /** The sets of chart data that is displayed on the chart **/
        $scope.chartDataSets = [];

        //////////

        // get all final tests of the project
        LearnResultResource.getAllFinal($scope.project.id)
            .then(function (tests) {
                $scope.tests = tests;
            });

        //////////

        /**
         * Create chart data from multiple selected final test results
         */
        $scope.chartFromMultipleFinalTestResults = function () {
            var tests = SelectionService.getSelected($scope.tests);
            if (tests.length > 0) {
                $scope.chartMode = $scope.chartModes.MULTIPLE_FINAL_TEST_RESULTS;
                $scope.chartDataSets = [TestResultsChartService.createChartDataFromMultipleTestResults(tests)];
            }
        };

        /**
         * Create chart data for a single complete test result with all intermediate steps. Therefore fetch all
         * intermediate steps first
         */
        $scope.chartFromSingleCompleteTestResult = function () {
            var tests = SelectionService.getSelected($scope.tests);
            if (tests.length == 1) {
            	LearnResultResource.getComplete($scope.project.id, tests[0].testNo)
                    .then(function (results) {
                        $scope.chartMode = $scope.chartModes.SINGLE_COMPLETE_TEST_RESULT;
                        $scope.chartDataSets = [TestResultsChartService.createChartDataFromSingleCompleteTestResult(results)];
                    });
            }
        };

        /**
         * Create chart data for two complete test result with all intermediate steps. Therefore fetch all
         * intermediate steps for both selected tests first
         */
        $scope.chartFromTwoCompleteTestResults = function () {
            var tests = SelectionService.getSelected($scope.tests);
            var dataSets = [];
            if (tests.length == 2) {
            	LearnResultResource.getComplete($scope.project.id, tests[0].testNo)
                    .then(function (results) {
                        dataSets.push(TestResultsChartService.createChartDataFromSingleCompleteTestResult(results));
                        LearnResultResource.getComplete($scope.project.id, tests[1].testNo)
                            .then(function (results) {
                                dataSets.push(TestResultsChartService.createChartDataFromSingleCompleteTestResult(results));
                                $scope.chartMode = $scope.chartModes.TWO_COMPLETE_TEST_RESULTS;
                                $scope.chartDataSets = dataSets;
                            })
                    })
            }
        };

        /**
         * Make the list of final test results visible again and remove the chart
         */
        $scope.back = function () {
            $scope.chartDataSets = [];
        };
    }
}());