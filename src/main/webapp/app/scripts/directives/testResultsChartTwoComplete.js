(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChartTwoComplete', testResultsChartTwoComplete);

    /**
     * testResultsChartTwoComplete
     *
     * The directive that should be applied to the element where the chart for the comparison of two complete test
     * results should be displayed. Requires that the directive 'testResultsChart' is applied to the element as well
     * because it works with it.
     *
     * Displays a line chart if there are at least two steps from the test results to display, otherwise a bar chart
     *
     * @return {{require: string, link: link}}
     */
    function testResultsChartTwoComplete() {

        var directive = {
            require: 'testResultsChart',
            link: link
        };
        return directive;

        //////////

        /**
         * @param scope
         * @param el
         * @param attrs
         * @param ctrl - the controller from 'testResultsChart'
         */
        function link(scope, el, attrs, ctrl) {

            var datasets0;
            var datasets1;

            // get chart data from the parent directive
            scope.chartData = ctrl.getChartData();
            scope.$watch('chartData', init);

            //////////

            /**
             * Initialize the directive
             * @param data
             */
            function init(data) {
                if (angular.isDefined(data)) {

                    // save the chart data for both complete test results separately
                    datasets0 = angular.copy(data[0].datasets);
                    datasets1 = angular.copy(data[1].datasets);

                    // remodel the data for the chart, take the one with most steps
                    if (data[1].labels.length > data[0].labels.length) {
                        data[0].labels = data[1].labels;
                    }
                    data = data[0];
                    // create the chart.js data sets for a single property for both tests
                    data.datasets = [
                        datasets0[0],
                        datasets1[0]
                    ];

                    // create a bar or a line chart
                    if (data.labels.length == 1) {
                        ctrl.createBarChart(data);
                        ctrl.setUpdate(updateBarChart);
                    } else if (data.labels.length > 1) {
                        ctrl.createLineChart(data);
                        ctrl.setUpdate(updateLineChart);
                    }
                }
            }

            /**
             * Update the displayable values of another property and update the chart when displaying a bar chart
             *
             * @param chart
             * @param property
             */
            function updateBarChart(chart, property) {
                _.forEach(datasets0[property].data, function (value, i) {
                    chart.datasets[0].bars[i].value = value;
                });
                _.forEach(datasets1[property].data, function (value, i) {
                    chart.datasets[1].bars[i].value = value;
                });
                chart.update();
            }

            /**
             * Update the displayable values of another property and update the chart when displaying a line chart
             *
             * @param chart
             * @param property
             */
            function updateLineChart(chart, property) {
                _.forEach(datasets0[property].data, function (value, i) {
                    chart.datasets[0].points[i].value = value;
                });
                _.forEach(datasets1[property].data, function (value, i) {
                    chart.datasets[1].points[i].value = value;
                });
                chart.update();
            }
        }
    }
}());