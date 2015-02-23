(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChart', testResultsChart);

    /**
     * testResultsChart
     *
     * The directive that is placed somewhere in your html markup in order to display the charts for displaying
     * the statistics of some test results.
     *
     * Use the attribute 'chart-data' on the element of the directive to pass the data that should be plotted
     *
     * @return {{scope: {chartData: string}, controller: *[], template: string}}
     */
    function testResultsChart() {

        var template = '' +
            '<div>' +
            '   <canvas id="test-results-chart" width="800" height="400"></canvas>' +
            '   <hr>' +
            '   <div class="text-center">' +
            '       <button class="btn btn-default btn-sm" ng-class="visibleChartProperty == chartProperties.DURATION ? \'active\' : \'\'" ng-click="showDuration()">Duration</button>' +
            '       <button class="btn btn-default btn-sm" ng-class="visibleChartProperty == chartProperties.AMOUNT_OF_RESETS ? \'active\' : \'\'" ng-click="showResets()">#Resets</button>' +
            '       <button class="btn btn-default btn-sm" ng-class="visibleChartProperty == chartProperties.AMOUNT_OF_SYMBOLS ? \'active\' : \'\'" ng-click="showSymbols()">#Symbols</button>' +
            '   </div>' +
            '</div>';

        //////////

        var directive = {
            scope: {
                chartData: '='
            },
            controller: [
                '$scope', '$element', 'TestResultsChartService',
                controller
            ],
            template: template
        };
        return directive;

        //////////

        /**
         * The controller for the directive testResultsChart that can be required by other directives
         *
         * @param $scope - the current scope
         * @param $element - the root element of the directive
         */
        function controller($scope, $element, TestResultsChartService) {

            // The canvas on which the charts will be drawn
            var canvas = $element.find('canvas')[0].getContext('2d');

            // The chart.js Chart object
            var chart;

            // The update method that is dynamically set by other directives in order to update the canvas
            var update;

            //////////

            $scope.chartProperties = TestResultsChartService.chartProperties;
            
            $scope.visibleChartProperty = $scope.chartProperties.AMOUNT_OF_SYMBOLS;

            //////////

            /**
             * Draw a bar chart on the canvas from data
             * @param data - the data in the format that is expected by chart.js
             */
            this.createBarChart = function (data) {
                chart = new Chart(canvas).Bar(data, {responsive: true});
            };

            /**
             * Draw a line chart on the canvas from data
             * @param data - the data in the format that is expected by chart.js
             */
            this.createLineChart = function (data) {
                chart = new Chart(canvas).Line(data, {responsive: true});
            };

            /**
             * Returns the data that was passed as an argument to the directive
             * @return {string|chartData}
             */
            this.getChartData = function () {
                return $scope.chartData;
            };

            /**
             * Set the method that is called to update the chart on the canvas
             * @param f - the update function with to params (chart, property)
             */
            this.setUpdate = function (f) {
                update = f;
            };

            //////////

            /**
             * Update the canvas and show the statistics for the duration of test results
             */
            $scope.showDuration = function () {
                update(chart, $scope.chartProperties.DURATION);
                $scope.visibleChartProperty = $scope.chartProperties.DURATION;
            };

            /**
             * Update the canvas and show the statistics for the number of resets of test results
             */
            $scope.showResets = function () {
                update(chart, $scope.chartProperties.AMOUNT_OF_RESETS);
                $scope.visibleChartProperty = $scope.chartProperties.AMOUNT_OF_RESETS
            };

            /**
             * Update the canvas and show the statistics for the number of symbols of test results
             */
            $scope.showSymbols = function () {
                update(chart, $scope.chartProperties.AMOUNT_OF_SYMBOLS);
                $scope.visibleChartProperty = $scope.chartProperties.AMOUNT_OF_SYMBOLS
            }
        }
    }
}());