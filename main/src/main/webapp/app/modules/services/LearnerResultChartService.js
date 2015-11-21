import _ from 'lodash';

/**
 * The service that helps transforming learn results into chart data that is required by n3-line-chart
 */
class LearnerResultChartService {

    /**
     * Creates chart data for a single final result
     * @param {LearnResult} result
     * @returns {{context, options, data}|*}
     */
    createDataSingleFinal(result) {
        const data = this.createDataMultipleFinal([result]);
        data.context = result;
        return data;
    }

    /**
     *
     * @param {LearnResult[]} intermediateResults
     */
    createDataSingleComplete(intermediateResults) {
        const options = {
            series: [
                {
                    y: "val_0",
                    label: 'Test' + intermediateResults[0].testNo,
                    color: "#4B6396",
                    type: "area"
                }
            ],
            axes: {
                x: {
                    labelFunction: (l) => {
                        if (l % 1 == 0 && l >= 1 && l <= intermediateResults.length) {
                            return 'Step ' + l;
                        }
                    }
                },
                y: {
                    grid: true
                }
            }
        };

        const data = {
            eqs: [{x: 0, val_0: 0}],
            mqs: [{x: 0, val_0: 0}],
            symbols: [{x: 0, val_0: 0}],
            sigma: [{x: 0, val_0: 0}],
            duration: [{x: 0, val_0: 0}]
        };

        intermediateResults.forEach((result, i) => {
            data.eqs.push({x: i + 1, val_0: result.statistics.eqsUsed});
            data.mqs.push({x: i + 1, val_0: result.statistics.mqsUsed});
            data.symbols.push({x: i + 1, val_0: result.statistics.symbolsUsed});
            data.sigma.push({x: i + 1, val_0: result.sigma.length});
            data.duration.push({x: i + 1, val_0: result.statistics.duration});
        });

        return {
            context: intermediateResults,
            options: options,
            data: data
        };
    }

    createDataMultipleFinal(results) {
        const options = {
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
            axes: {
                x: {
                    type: "linear", key: "x"
                },
                y: {
                    type: "linear", min: 0, grid: true
                }
            },
            lineMode: "linear",
            tension: 0.4,
            tooltip: {mode: "scrubber"},
            drawLegend: false,
            drawDots: true,
            columnsHGap: 15,
            margin: {bottom: '24px'}
        };

        options.axes.x.labelFunction = (l) => {
            if (l % 1 === 0 && l >= 1 && l <= results.length) {
                return 'Test ' + results[l - 1].testNo;
            }
        };

        const data = {
            eqs: [],
            mqs: [],
            symbols: [],
            sigma: [],
            duration: []
        };

        results.forEach((result, i) => {
            let j = i + 1;
            data.eqs.push({x: j, val_0: result.statistics.eqsUsed});
            data.mqs.push({x: j, val_0: result.statistics.mqsUsed});
            data.symbols.push({x: j, val_0: result.statistics.symbolsUsed});
            data.sigma.push({x: j, val_0: result.sigma.length});
            data.duration.push({x: j, val_0: result.statistics.duration});
        });

        return {
            context: results,
            options: options,
            data: data
        }
    }

    createDataMultipleComplete(resultList) {
        const colors = ['#4B6396', '#3BA3B8', '#3BB877', '#8ACF36', '#E8E835', '#F7821B', '#F74F1B', '#C01BF7'];
        const props = ['eqs', 'mqs', 'symbols', 'sigma', 'duration'];

        // find value from test results where #steps is max
        let maxSteps = 0;
        resultList.forEach(results => {
            maxSteps = results.length > maxSteps ? results.length : maxSteps;
        });

        const options = {
            series: [],
            axes: {
                x: {
                    labelFunction: (l) => {
                        if (l % 1 == 0 && l >= 1 && l <= maxSteps) {
                            return 'Step ' + l;
                        }
                    }
                },
                y: {
                    grid: true
                }
            }
        };

        const data = {eqs: [], mqs: [], symbols: [], sigma: [], duration: []};
        const values = {eqs: [], mqs: [], symbols: [], sigma: [], duration: []};

        resultList.forEach((results, i) => {

            // extract all values from the results
            const eqs = results.map(r => r.statistics.eqsUsed);
            const mqs = results.map(r => r.statistics.mqsUsed);
            const symbols = results.map(r => r.statistics.symbolsUsed);
            const sigma = results.map(r => r.sigma.length);
            const duration = results.map(r => r.statistics.duration);

            // fill all other values with zeroes in order to
            // reduce visual bugs
            while (eqs.length < maxSteps) eqs.push(0);
            while (mqs.length < maxSteps) mqs.push(0);
            while (symbols.length < maxSteps) symbols.push(0);
            while (sigma.length < maxSteps) sigma.push(0);
            while (duration.length < maxSteps) duration.push(0);

            values.eqs.push(eqs);
            values.mqs.push(mqs);
            values.symbols.push(symbols);
            values.sigma.push(sigma);
            values.duration.push(duration);

            // add options for specific area
            options.series.push({
                y: "val_" + i,
                color: colors[i % colors.length],
                label: 'Test' + results[0].testNo,
                type: "area"
            })
        });

        props.forEach(prop => {

            // fill the data with initial zero values
            const set = {x: 0};
            for (let i = 0; i < resultList.length; i++) {
                set['val_' + i] = 0;
            }
            data[prop].push(set);

            // combine collected values and create chart data from it
            const combinedValues = _.zip(...values[prop]);
            combinedValues.forEach((value, i) => {
                const r = {x: i + 1};
                value.forEach((val, j) => {
                    r['val_' + j] = val;
                });
                data[prop].push(r);
            })
        });

        return {
            context: resultList,
            options: options,
            data: data
        }
    }
}

export default LearnerResultChartService;