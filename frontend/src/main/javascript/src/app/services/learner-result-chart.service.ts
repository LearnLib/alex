/*
 * Copyright 2015 - 2019 TU Dortmund
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

import { zip } from 'lodash';
import { LearnResult } from '../entities/learner-result';
import { Injectable } from '@angular/core';

const MARGIN_OPTIONS = {
  top: 20,
  right: 50,
  bottom: 20,
  left: 50
};

const GRID_OPTIONS = {
  x: false,
  y: true
};

/**
 * The service that helps transforming learn results into chart data that is required by n3-line-chart.
 */
@Injectable()
export class LearnerResultChartService {

  createDataSingleFinal(result: LearnResult): any {
    const options = {
      margin: MARGIN_OPTIONS,
      grid: GRID_OPTIONS,
      series: [{
        axis: 'y',
        dataset: 'dataset',
        key: 'y',
        label: ' ',
        color: '#4B6396',
        type: ['column'],
        id: 'mySeries0'
      }],
      axes: {
        x: {
          key: 'x',
          type: 'linear',
          ticks: [0, 1, 2, 3, 4],
          tickFormat: (value, index) => {
            return [' ', 'Total', 'Learner', 'EQ Oracle', ' '][index];
          }
        },
        y: {
          min: 0
        }
      }
    };

    const data = {
      mqs: {
        dataset: [
          {x: 0, y: 0},
          {x: 1, y: result.statistics.mqsUsed.total},
          {x: 2, y: result.statistics.mqsUsed.learner},
          {x: 3, y: result.statistics.mqsUsed.eqOracle},
          {x: 4, y: 0},
        ]
      },
      symbols: {
        dataset: [
          {x: 0, y: 0},
          {x: 1, y: result.statistics.symbolsUsed.total},
          {x: 2, y: result.statistics.symbolsUsed.learner},
          {x: 3, y: result.statistics.symbolsUsed.eqOracle},
          {x: 4, y: 0},
        ]
      },
      duration: {
        dataset: [
          {x: 0, y: 0},
          {x: 1, y: result.statistics.duration.total},
          {x: 2, y: result.statistics.duration.learner},
          {x: 3, y: result.statistics.duration.eqOracle},
          {x: 4, y: 0},
        ]
      }
    };

    return {
      context: result,
      options: options,
      data: data
    };
  }

  /**
   * @param result
   */
  createDataSingleComplete(result: LearnResult): any {
    const options = {
      margin: MARGIN_OPTIONS,
      grid: GRID_OPTIONS,
      series: [
        {
          axis: 'y',
          dataset: 'dataset',
          key: 'y0',
          label: 'Total',
          color: '#4B6396',
          type: ['dot', 'line', 'area'],
          id: 'mySeries0'
        },
        {
          axis: 'y',
          dataset: 'dataset',
          key: 'y1',
          label: 'Learner',
          color: '#3BB877',
          type: ['dot', 'line', 'area'],
          id: 'mySeries1'
        },
        {
          axis: 'y',
          dataset: 'dataset',
          key: 'y2',
          label: 'EQ Oracle',
          color: '#C01BF7',
          type: ['dot', 'line', 'area'],
          id: 'mySeries2'
        }
      ],
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
      mqs: {
        dataset: [
          {x: 0, y0: 0, y1: 0, y2: 0}
        ]
      },
      symbols: {
        dataset: [
          {x: 0, y0: 0, y1: 0, y2: 0}
        ]
      },
      duration: {
        dataset: [
          {x: 0, y0: 0, y1: 0, y2: 0}
        ]
      }
    };

    result.steps.forEach((step, i) => {
      i = i + 1;

      data.mqs.dataset.push({
        x: i,
        y0: step.statistics.mqsUsed.total,
        y1: step.statistics.mqsUsed.learner,
        y2: step.statistics.mqsUsed.eqOracle
      });
      data.symbols.dataset.push({
        x: i,
        y0: step.statistics.symbolsUsed.total,
        y1: step.statistics.symbolsUsed.learner,
        y2: step.statistics.symbolsUsed.eqOracle
      });
      data.duration.dataset.push({
        x: i,
        y0: step.statistics.duration.total,
        y1: step.statistics.duration.learner,
        y2: step.statistics.duration.eqOracle
      });
    });

    return {
      context: result,
      options: options,
      data: data
    };
  }

  createDataMultipleFinal(results: LearnResult[]): any {
    const options = {
      margin: MARGIN_OPTIONS,
      grid: GRID_OPTIONS,
      series: [{
        axis: 'y',
        dataset: 'dataset',
        key: 'y',
        label: ' ',
        color: '#4B6396',
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
      mqs: {dataset: [{x: 0, y: 0}]},
      symbols: {dataset: [{x: 0, y: 0}]},
      duration: {dataset: [{x: 0, y: 0}]}
    };

    results.forEach((result, i) => {
      let j = i + 1;
      data.mqs.dataset.push({x: j, y: result.statistics.mqsUsed.total});
      data.symbols.dataset.push({x: j, y: result.statistics.symbolsUsed.total});
      data.duration.dataset.push({x: j, y: result.statistics.duration.total});
    });

    const last = results.length + 1;
    data.mqs.dataset.push({x: last, y: 0});
    data.symbols.dataset.push({x: last, y: 0});
    data.duration.dataset.push({x: last, y: 0});

    return {
      context: results,
      options: options,
      data: data
    };
  }

  createDataMultipleComplete(results: LearnResult[]): any {
    const colors = ['#4B6396', '#3BA3B8', '#3BB877', '#8ACF36', '#E8E835', '#F7821B', '#F74F1B', '#C01BF7'];
    const props = ['mqs', 'symbols', 'duration'];

    // find value from test results where #steps is max
    let maxSteps = 0;
    results.forEach(result => {
      maxSteps = result.steps.length > maxSteps ? result.steps.length : maxSteps;
    });

    const options = {
      margin: MARGIN_OPTIONS,
      grid: GRID_OPTIONS,
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
      mqs: {dataset: []},
      symbols: {dataset: []},
      duration: {dataset: []}
    };

    const values = {
      mqs: {dataset: []},
      symbols: {dataset: []},
      duration: {dataset: []}
    };

    results.forEach((result, i) => {

      // extract all values from the results
      const mqs = result.steps.map(s => s.statistics.mqsUsed.total);
      const symbols = result.steps.map(s => s.statistics.symbolsUsed.total);
      const duration = result.steps.map(s => s.statistics.duration.total);

      // fill all other values with zeroes in order to
      // reduce visual bugs
      while (mqs.length < maxSteps) mqs.push(0);
      while (symbols.length < maxSteps) symbols.push(0);
      while (duration.length < maxSteps) duration.push(0);

      values.mqs.dataset.push(mqs);
      values.symbols.dataset.push(symbols);
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
      const combinedValues = zip(...values[prop].dataset);
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
