(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChartSingleComplete', testResultsChartSingleComplete);

    /**
     * testResultsChartSingleComplete
     *
     * The directive that should be applied to the element where the chart for a single complete test result should be
     * displayed. Requires that the directive 'testResultsChart' is applied to the element as well because it works with
     * it.
     *
     * Displays a line chart if there are at least two steps from the test results to display, otherwise a bar chart
     *
     * @return {{require: string, link: link}}
     */
    function testResultsChartSingleComplete() {

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

            var datasets;

            // get the chart data from the paren directive
            scope.chartData = ctrl.getChartData();
            scope.$watch('chartData', init);

            //////////

            /**
             * Initialize the directive
             * @param data
             */
            function init(data) {
                if (angular.isDefined(data)) {
                    data = data[0];

                    datasets = angular.copy(data.datasets);
                    data.datasets = [datasets[0]];

                    if (data.datasets[0].data.length == 1) {
                        ctrl.createBarChart(data);
                        ctrl.setUpdate(updateBarChart)

                    } else {
                        ctrl.createLineChart(data);
                        ctrl.setUpdate(updateLineChart)
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
                _.forEach(datasets[property].data, function (value, i) {
                    chart.datasets[0].bars[i].value = value;
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
                _.forEach(datasets[property].data, function (value, i) {
                    chart.datasets[0].points[i].value = value;
                });
                chart.update();
            }
        }
    }
}());