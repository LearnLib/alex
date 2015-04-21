(function () {
    'use strict';

    angular
        .module('ALEX.services')
        .factory('LearnerResultChartService', LearnerResultChartService);

    LearnerResultChartService.$inject = ['_'];

    /**
     * The service to create n3 line chart data from learner results. Can create bar chart data from multiple final
     * learner results and area chart data from multiple complete learner results.
     *
     * @param _ - Lodash
     * @returns {{createDataFromMultipleFinalResults: createDataFromMultipleFinalResults, createDataFromMultipleCompleteResults: createDataFromMultipleCompleteResults, properties: {MQS: string, EQS: string, SYMBOL_CALLS: string, SIGMA: string, DURATION: string}}}
     * @constructor
     */
    function LearnerResultChartService(_) {

        // The learner result properties
        var properties = {
            MQS: 'mqsUsed',
            EQS: 'eqsUsed',
            SYMBOL_CALLS: 'symbolsUsed',
            SIGMA: 'sigma',
            DURATION: 'duration'
        };

        // The available service data
        return {
            createDataFromMultipleFinalResults: createDataFromMultipleFinalResults,
            createDataFromMultipleCompleteResults: createDataFromMultipleCompleteResults,
            properties: properties
        };

        /**
         * Creates bar chart data from a list of final learner results which includes the data itself and options.
         *
         * @param results - The learner results from that the chart data should be created
         * @param property - The learner results property from that the data should be used
         * @returns {{data: Array, options: {series: {y: string, color: string, type: string, axis: string, id: string}[], stacks: Array, axes: {x: {type: string, key: string}, y: {type: string, min: number}}, lineMode: string, tension: number, tooltip: {mode: string}, drawLegend: boolean, drawDots: boolean, columnsHGap: number}}}
         */
        function createDataFromMultipleFinalResults(results, property) {

            var dataSets = [];
            var dataValues = [];
            var options = {
                series: [
                    {
                        y: "val_0",
                        color: "#4B6396",
                        type: "column",
                        axis: "y",
                        id: "series_0"
                    }
                ],
                stacks: [],
                axes: {x: {type: "linear", key: "x"}, y: {type: "linear", min: 0}},
                lineMode: "linear",
                tension: 0.7,
                tooltip: {mode: "scrubber"},
                drawLegend: false,
                drawDots: true,
                columnsHGap: 3
            };

            var statistics = _.pluck(results, 'statistics');

            // extract values from learner results by a property
            switch (property) {
                case properties.MQS:
                    dataValues = _.pluck(statistics, properties.MQS);
                    break;
                case properties.EQS:
                    dataValues = _.pluck(statistics, properties.EQS);
                    break;
                case properties.SIGMA:
                    dataValues = _.map(_.pluck(results, properties.SIGMA), function (n) {
                        return n.length
                    });
                    break;
                case properties.SYMBOL_CALLS:
                    dataValues = _.pluck(statistics, properties.SYMBOL_CALLS);
                    break;
                case properties.DURATION:
                    dataValues = _.pluck(statistics, properties.DURATION);
                    break;
                default :
                    break;
            }

            // create n3 line chart dataSets from extracted values
            for (var i = 0; i < dataValues.length; i++) {
                dataSets.push({
                    x: i,
                    val_0: dataValues[i]
                });
            }

            // create dummy data so that bar gets displayed correctly
            if (dataSets.length === 1) {
                dataSets.push({
                    x: 1,
                    val_1: 0
                })
            }

            // create x axis labels for each test result
            options.axes.x.labelFunction = function (l) {
                if (l % 1 == 0 && l >= 0 && l < results.length) {
                    return 'Test ' + results[l].testNo;
                }
            };

            return {
                data: dataSets,
                options: options
            };
        }

        /**
         * Creates area chart data from a list of complete learner results which includes the data itself and options.
         *
         * @param results - A list of complete learner results
         * @param property - The learner result property from which the chart data should be created
         * @returns {{data: Array, options: {series: Array, stacks: Array, axes: {x: {type: string, key: string}, y: {type: string, min: number}}, lineMode: string, tension: number, tooltip: {mode: string}, drawLegend: boolean, drawDots: boolean, columnsHGap: number}}}
         */
        function createDataFromMultipleCompleteResults(results, property) {

            var dataSets = [];
            var dataValues = [];
            var maxSteps = 0;
            var options = {
                series: [],
                stacks: [],
                axes: {x: {type: "linear", key: "x"}, y: {type: "linear", min: 0}},
                lineMode: "linear",
                tension: 0.7,
                tooltip: {mode: "scrubber"},
                drawLegend: true,
                drawDots: true,
                columnsHGap: 3
            };
            var colors = ['#4B6396', '#3BA3B8', '#3BB877', '#8ACF36', '#E8E835', '#F7821B', '#F74F1B', '#C01BF7'];
            var i, j;

            // extract values from learner results by a property
            switch (property) {
                case properties.MQS:
                    _.forEach(results, function (result) {
                        dataValues.push(_(result).pluck('statistics').pluck(properties.MQS).value());
                    });

                    break;
                case properties.EQS:
                    _.forEach(results, function (result) {
                        dataValues.push(_(result).pluck('statistics').pluck(properties.EQS).value());
                    });
                    break;
                case properties.SIGMA:
                    _.forEach(results, function (result) {
                        dataValues.push(_.map(_.pluck(result, properties.SIGMA), function (n) {
                            return n.length;
                        }));
                    });
                    break;
                case properties.SYMBOL_CALLS:
                    _.forEach(results, function (result) {
                        dataValues.push(_(result).pluck('statistics').pluck(properties.SYMBOL_CALLS).value());
                    });
                    break;
                case properties.DURATION:
                    _.forEach(results, function (result) {
                        dataValues.push(_(result).pluck('statistics').pluck(properties.DURATION).value());
                    });
                    break;
                default :
                    break;
            }

            // find value from test results where #steps is max
            for (i = 0; i < dataValues.length; i++) {
                if (dataValues[i].length > maxSteps) {
                    maxSteps = dataValues[i].length;
                }
            }

            // fill all other values with zeroes
            for (i = 0; i < dataValues.length; i++) {
                if (dataValues[i].length < maxSteps) {
                    for (j = dataValues[i].length; j < maxSteps; j++) {
                        dataValues[i][j] = 0;
                    }
                }
            }

            // create data sets
            for (i = 0; i < maxSteps; i++) {
                var data = {x: i};
                for (j = 0; j < dataValues.length; j++) {
                    data['val_' + j] = dataValues[j][i];
                }
                dataSets.push(data);
            }

            // create options for each test
            for (i = 0; i < results.length; i++) {
                options.series.push({
                    y: 'val_' + i,
                    color: colors[i % colors.length],
                    type: 'area',
                    axis: 'y',
                    id: 'series_' + i,
                    label: 'Test ' + results[i][0].testNo
                })
            }

            // create customs x axis labels
            options.axes.x.labelFunction = function (l) {
                if (l % 1 == 0 && l >= 0 && l < maxSteps) {
                    return 'Step ' + (l + 1);
                }
            };

            return {
                data: dataSets,
                options: options
            }
        }
    }
}());