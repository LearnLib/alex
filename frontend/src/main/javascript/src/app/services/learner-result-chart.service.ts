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

import { LearnerResult } from '../entities/learner-result';
import { Injectable } from '@angular/core';

/**
 * The service that helps transforming learn results into chart data that is required by n3-line-chart.
 */
@Injectable()
export class LearnerResultChartService {

  options = {
    //general options
    legend: false
    ,xAxis: true
    ,yAxis: true
    ,showGridLines: true
    ,roundDomains: false
    ,showXAxisLabel: false
    ,showYAxisLabel: false
    ,gradient: true

    //bar-chart options
    ,noBarWhenZero: false
    ,barPadding: 20
    ,showDataLabel: true
    ,schemeBarChart: {
      domain: ['#4B6396', '#3BA3B8', '#C01BF7', '#3BB877', '#8ACF36', '#E8E835', '#F7821B', '#F74F1B']
    }

    //area-chart options
    ,legendAreaChart: true
    ,timeline: true
    ,schemeAreaChart: {
      domain: ['#4B6396', '#3BA3B8', '#C01BF7', '#3BB877', '#8ACF36', '#E8E835', '#F7821B', '#F74F1B']
    }
    ,showXAxisLabelAreaChart: false
    ,showYAxisLabelAreaChart: false
    ,xAxisLabelAreaChart: "Steps"
    ,yAxisLabelAreaChart: ""

  };

  createDataSingleFinal(result: LearnerResult): any {

    const data = {
      mqs: [
        {
          "name": "Total",
          "value": result.statistics.mqsUsed.total
        },
        {
          "name": "Learner",
          "value": result.statistics.mqsUsed.learner
        },
        {
          "name": "EQ Oracle",
          "value": result.statistics.mqsUsed.eqOracle
        }
       ],
      symbols: [
        {
          "name": "Total",
          "value": result.statistics.symbolsUsed.total
        },
        {
          "name": "Learner",
          "value": result.statistics.symbolsUsed.learner
        },
        {
          "name": "EQ Oracle",
          "value": result.statistics.symbolsUsed.eqOracle
        }
      ],
      duration: [
        {
          "name": "Total",
          "value": result.statistics.duration.total
        },
        {
          "name": "Learner",
          "value": result.statistics.duration.learner
        },
        {
          "name": "EQ Oracle",
          "value": result.statistics.duration.eqOracle
        }
      ]
    };

    return {
      context: result,
      options: this.options,
      data: data
    };
  }

  createDataSingleComplete(result: LearnerResult): any {

    const mqs_total_series = [{name: 0, "value": 0}];
    const mqs_learner_series = [{name: 0, "value": 0}];
    const mqs_oracle_series = [{name: 0, "value": 0}];
    const symbols_total_series = [{name: 0, "value": 0}];
    const symbols_learner_series = [{name: 0, "value": 0}];
    const symbols_oracle_series = [{name: 0, "value": 0}];
    const duration_total_series = [{name: 0, "value": 0}];
    const duration_learner_series = [{name: 0, "value": 0}];
    const duration_oracle_series = [{name: 0, "value": 0}];

    result.steps.forEach((step, i) => {
      i = i + 1;

      mqs_total_series.push({
        name: i,
        "value": step.statistics.mqsUsed.total
      });
      mqs_learner_series.push({
        name: i,
        "value": step.statistics.mqsUsed.learner
      });
      mqs_oracle_series.push({
        name: i,
        "value": step.statistics.mqsUsed.eqOracle
      });
      symbols_total_series.push({
        name: i,
        "value": step.statistics.symbolsUsed.total
      });
      symbols_learner_series.push({
        name: i,
        "value": step.statistics.symbolsUsed.learner
      });
      symbols_oracle_series.push({
        name: i,
        "value": step.statistics.symbolsUsed.eqOracle
      });
      duration_total_series.push({
        name: i,
        "value": step.statistics.duration.total
      });
      duration_learner_series.push({
        name: i,
        "value": step.statistics.duration.learner
      });
      duration_oracle_series.push({
        name: i,
        "value": step.statistics.duration.eqOracle
      });
    });

    const data = {
      mqs: [
        {
          "name": "Total",
          "series": mqs_total_series
        },
        {
          "name": "Learner",
          "series": mqs_learner_series
        },
        {
          "name": "EQ Oracle",
          "series": mqs_oracle_series
        }
      ],
      symbols: [
        {
          "name": "Total",
          "series": symbols_total_series
        },
        {
          "name": "Learner",
          "series": symbols_learner_series
        },
        {
          "name": "EQ Oracle",
          "series": symbols_oracle_series
        }
      ],
      duration: [
        {
          "name": "Total",
          "series": duration_total_series
        },
        {
          "name": "Learner",
          "series": duration_learner_series
        },
        {
          "name": "EQ Oracle",
          "series": duration_oracle_series
        }
      ]
    };

    return {
      context: result,
      options: this.options,
      data: data
    };
  }

  createDataMultipleFinal(results: LearnerResult[]): any {

    const data = {
      mqs: [],
      symbols: [],
      duration: []
    };

    results.forEach((result) => {
      data.mqs.push({
        "name": "Test " + result.testNo,
        "value": result.statistics.mqsUsed.total
      });
      data.symbols.push({
        "name": "Test " + result.testNo,
        "value": result.statistics.symbolsUsed.total
      });
      data.duration.push({
        "name": "Test " + result.testNo,
        "value": result.statistics.duration.total
      })
    });


    return {
      context: results,
      options: this.options,
      data: data
    }
  }

  createDataMultipleComplete(results: LearnerResult[]): any {

    const data = {
      mqs: [],
      symbols: [],
      duration: []
    };

    results.forEach((result) => {

      const mqs_total_series = [{name: 0, "value": 0}];
      const symbols_total_series = [{name: 0, "value": 0}];
      const duration_total_series = [{name: 0, "value": 0}];

      result.steps.forEach((step, i) => {

        i = i + 1;

        mqs_total_series.push({
          name: i,
          "value": step.statistics.mqsUsed.total
        });
        symbols_total_series.push({
          name: i,
          "value": step.statistics.symbolsUsed.total
        });
        duration_total_series.push({
          name: i,
          "value": step.statistics.duration.total
        })

      });

      data.mqs.push({
        "name": "Test " + result.testNo,
        "series": mqs_total_series
      });
      data.symbols.push({
        "name": "Test " + result.testNo,
        "series": symbols_total_series
      });
      data.duration.push({
        "name": "Test " + result.testNo,
        "series": duration_total_series
      })

    });

    return {
      context: results,
      options: this.options,
      data: data
    }
  }
}
