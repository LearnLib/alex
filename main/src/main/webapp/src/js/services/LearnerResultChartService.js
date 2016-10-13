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

import _ from "lodash";

/**
 * The service that helps transforming learn results into chart data that is required by n3-line-chart.
 */
export class LearnerResultChartService {

    /**
     * Creates chart data for a single final result.
     *
     * @param {LearnResult} result
     * @returns {{context, options, data}|*}
     */
    createDataSingleFinal(result) {
        const data = this.createDataMultipleFinal([result]);
        data.context = result;
        return data;
    }

    /**
     * @param {LearnResult} result
     */
    createDataSingleComplete(result) {
        const options = {
            margin: {
                top: 20,
                right: 50,
                bottom: 20,
                left: 50
            },
            grid: {
                x: false,
                y: true
            },
            series: [{
                axis: 'y',
                dataset: 'dataset',
                key: 'y',
                label: ' ',
                color: "#4B6396",
                type: ['dot', 'line', 'area'],
                id: 'mySeries0'
            }],
            axes: {
                x: {
                    key: 'x',
                    type: 'linear',
                    tickFormat: (l) => {
                        if (l % 1 === 0 && l >= 1 && l <= result.steps.length) {
                            return 'Step ' + l;
                        }
                    }
                },
                y: {
                    min: 0
                }
            }
        };

        const data = {
            eqs: {dataset: [{x: 0, y: 0}]},
            mqs: {dataset: [{x: 0, y: 0}]},
            symbols: {dataset: [{x: 0, y: 0}]},
            sigma: {dataset: [{x: 0, y: 0}]},
            duration: {dataset: [{x: 0, y: 0}]}
        };

        result.steps.forEach((step, i) => {
            data.eqs.dataset.push({x: i + 1, y: step.statistics.eqsUsed});
            data.mqs.dataset.push({x: i + 1, y: step.statistics.mqsUsed.total});
            data.symbols.dataset.push({x: i + 1, y: step.statistics.symbolsUsed.total});
            data.sigma.dataset.push({x: i + 1, y: result.sigma.length});
            data.duration.dataset.push({x: i + 1, y: step.statistics.duration.total});
        });

        return {
            context: result,
            options: options,
            data: data
        };
    }

    createDataMultipleFinal(results) {
        const options = {
            margin: {
                top: 20,
                right: 50,
                bottom: 20,
                left: 50
            },
            grid: {
                x: false,
                y: true
            },
            series: [{
                axis: 'y',
                dataset: 'dataset',
                key: 'y',
                label: ' ',
                color: "#4B6396",
                type: ['column'],
                id: 'mySeries0'
            }],
            axes: {
                x: {
                    key: 'x',
                    type: 'linear',
                    tickFormat: (value) => {
                        if (value % 1 === 0 && value >= 1 && value <= results.length) {
                            return 'Test ' + results[value - 1].testNo;
                        }
                    }
                },
                y: {
                    min: 0
                }
            }
        };

        const data = {
            eqs: {dataset: [{x: 0, y: 0}]},
            mqs: {dataset: [{x: 0, y: 0}]},
            symbols: {dataset: [{x: 0, y: 0}]},
            sigma: {dataset: [{x: 0, y: 0}]},
            duration: {dataset: [{x: 0, y: 0}]}
        };

        results.forEach((result, i) => {
            let j = i + 1;
            data.eqs.dataset.push({x: j, y: result.statistics.eqsUsed});
            data.mqs.dataset.push({x: j, y: result.statistics.mqsUsed.total});
            data.symbols.dataset.push({x: j, y: result.statistics.symbolsUsed.total});
            data.sigma.dataset.push({x: j, y: result.sigma.length});
            data.duration.dataset.push({x: j, y: result.statistics.duration.total});
        });

        const last = results.length + 1;
        data.eqs.dataset.push({x: last, y: 0});
        data.mqs.dataset.push({x: last, y: 0});
        data.symbols.dataset.push({x: last, y: 0});
        data.sigma.dataset.push({x: last, y: 0});
        data.duration.dataset.push({x: last, y: 0});

        return {
            context: results,
            options: options,
            data: data
        };
    }

    createDataMultipleComplete(results) {
        const colors = ['#4B6396', '#3BA3B8', '#3BB877', '#8ACF36', '#E8E835', '#F7821B', '#F74F1B', '#C01BF7'];
        const props = ['eqs', 'mqs', 'symbols', 'sigma', 'duration'];

        // find value from test results where #steps is max
        let maxSteps = 0;
        results.forEach(result => {
            maxSteps = result.steps.length > maxSteps ? result.steps.length : maxSteps;
        });

        const options = {
            margin: {
                top: 20,
                right: 50,
                bottom: 20,
                left: 50
            },
            grid: {
                x: false,
                y: true
            },
            series: [],
            axes: {
                x: {
                    key: 'x',
                    type: 'linear',
                    tickFormat: (l) => {
                        if (l % 1 === 0 && l >= 1 && l <= maxSteps) {
                            return 'Step ' + l;
                        }
                    }
                },
                y: {
                    min: 0
                }
            }
        };

        const data = {
            eqs: {dataset: []},
            mqs: {dataset: []},
            symbols: {dataset: []},
            sigma: {dataset: []},
            duration: {dataset: []}
        };
        const values = {
            eqs: {dataset: []},
            mqs: {dataset: []},
            symbols: {dataset: []},
            sigma: {dataset: []},
            duration: {dataset: []}
        };

        results.forEach((result, i) => {

            // extract all values from the results
            const eqs = result.steps.map(s => s.statistics.eqsUsed);
            const mqs = result.steps.map(s => s.statistics.mqsUsed.total);
            const symbols = result.steps.map(s => s.statistics.symbolsUsed.total);
            const sigma = result.steps.map(s => result.sigma.length);
            const duration = result.steps.map(s => s.statistics.duration.total);

            // fill all other values with zeroes in order to
            // reduce visual bugs
            while (eqs.length < maxSteps) eqs.push(0);
            while (mqs.length < maxSteps) mqs.push(0);
            while (symbols.length < maxSteps) symbols.push(0);
            while (sigma.length < maxSteps) sigma.push(0);
            while (duration.length < maxSteps) duration.push(0);

            values.eqs.dataset.push(eqs);
            values.mqs.dataset.push(mqs);
            values.symbols.dataset.push(symbols);
            values.sigma.dataset.push(sigma);
            values.duration.dataset.push(duration);

            // add options for specific area
            options.series.push({
                axis: 'y',
                dataset: 'dataset',
                key: 'y' + i,
                label: 'Test' + result.testNo,
                color: colors[i % colors.length],
                type: ['dot', 'line', 'area'],
                id: 'mySeries' + i
            });
        });

        props.forEach(prop => {

            // fill the data with initial zero values
            const set = {x: 0};
            for (let i = 0; i < results.length; i++) {
                set['y' + i] = 0;
            }
            data[prop].dataset.push(set);

            // combine collected values and create chart data from it
            const combinedValues = _.zip(...values[prop].dataset);
            combinedValues.forEach((value, i) => {
                const r = {x: i + 1};
                value.forEach((val, j) => {
                    r['y' + j] = val;
                });
                data[prop].dataset.push(r);
            });
        });

        return {
            context: results,
            options: options,
            data: data
        };
    }
}