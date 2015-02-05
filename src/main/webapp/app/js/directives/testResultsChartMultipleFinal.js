(function () {
    'use strict';

    angular
        .module('weblearner.directives')
        .directive('testResultsChartMultipleFinal', testResultsChartMultipleFinal);

    /**
     * testResultsChartMultipleFinal
     *
     * The directive that should be applied to the element where the chart for the comparison of multiple final test
     * results should be displayed. Requires that the directive 'testResultsChart' is applied to the element as well
     * because it works with it.
     *
     * Displays a bar chart.
     *
     * @return {{require: string, link: link}}
     */
    function testResultsChartMultipleFinal() {

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

            // The cache that holds all chart.js data sets for a set of results
            var datasets;

            // get the chart data from the parent directive controller and initialize this directive
            scope.chartData = ctrl.getChartData();
            scope.$watch('chartData', init);

            //////////

            /**
             * Initialize the directive
             *
             * @param data - the data in the format of a chart.js bar chart
             */
            function init(data) {
                if (angular.isDefined(data)) {
                    data = data[0];

                    // save all data sets for later manipulation
                    datasets = angular.copy(data.datasets);
                    // show a single value
                    data.datasets = [datasets[0]];

                    ctrl.createBarChart(data);
                    ctrl.setUpdate(update)
                }
            }

            /**
             * The method that updates the chart. It is called when the user wants to see another value of the test
             *
             * @param chart - the chart.js object
             * @param property - the property that should be plotted on the canvas
             */
            function update(chart, property) {
                _.forEach(datasets[property].data, function (value, i) {
                    chart.datasets[0].bars[i].value = value;
                });
                chart.update();
            }
        }
    }
}());