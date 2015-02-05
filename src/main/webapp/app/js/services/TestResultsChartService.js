(function () {
    'use strict';

    angular
        .module('weblearner.services')
        .service('TestResultsChartService', TestResultsChartService);

    /**
     * @return {{createChartDataFromMultipleTestResults: createChartDataFromMultipleTestResults, createChartDataFromSingleCompleteTestResult: createChartDataFromSingleCompleteTestResult}}
     * @constructor
     */
    function TestResultsChartService() {

        var chartProperties = {
            AMOUNT_OF_SYMBOLS: 0,
            DURATION: 1,
            AMOUNT_OF_RESETS: 2
        };

        var service = {
            createChartDataFromMultipleTestResults: createChartDataFromMultipleTestResults,
            createChartDataFromSingleCompleteTestResult: createChartDataFromSingleCompleteTestResult,
            chartProperties: chartProperties
        };
        return service;

        //////////

        /**
         * Create a chart.js conform dataset for a line or a bar chart
         *
         * @param label
         * @param data
         * @return {{label: *, fillColor: string, strokeColor: string, pointColor: string, pointStrokeColor: string, pointHighlightFill: string, pointHighlightStroke: string, data: *}}
         * @private
         */
        function _createDataSet(label, data) {

            var dataSet = {
                label: label,
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: data
            };
            return dataSet;
        }

        //////////

        /**
         * @param results
         * @return {{labels: Array, datasets: *[]}}
         */
        function createChartDataFromMultipleTestResults(results) {

            var chartData = {
                labels: [],
                datasets: [
                    _createDataSet('Symbols', []),
                    _createDataSet('Duration', []),
                    _createDataSet('Resets', [])
                ]
            };

            _.forEach(results, function (result) {
                chartData.labels.push('Test ' + result.testNo);
                chartData.datasets[chartProperties.AMOUNT_OF_SYMBOLS]
                    .data.push(result.sigma.length);
                chartData.datasets[chartProperties.DURATION]
                    .data.push(result.duration);
                chartData.datasets[chartProperties.AMOUNT_OF_RESETS]
                    .data.push(result.amountOfResets);
            });

            return chartData;
        }

        /**
         * @param results
         * @return {{labels: Array, datasets: *[]}}
         */
        function createChartDataFromSingleCompleteTestResult(results) {

            var chartData = {
                labels: [],
                datasets: [
                    _createDataSet('Symbols', []),
                    _createDataSet('Duration', []),
                    _createDataSet('Resets', [])
                ]
            };

            _.forEach(results, function (result) {
                chartData.labels.push('Step ' + result.stepNo);
                chartData.datasets[chartProperties.AMOUNT_OF_SYMBOLS]
                    .data.push(result.sigma.length);
                chartData.datasets[chartProperties.DURATION]
                    .data.push(result.duration);
                chartData.datasets[chartProperties.AMOUNT_OF_RESETS]
                    .data.push(result.amountOfResets);
            });

            return chartData;
        }
    }
}());
