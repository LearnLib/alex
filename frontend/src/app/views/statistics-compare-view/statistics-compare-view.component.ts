/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { LearnerResultApiService } from '../../services/api/learner-result-api.service';
import { LearnerResultChartService } from '../../services/learner-result-chart.service';
import { ToastService } from '../../services/toast.service';
import { DownloadService } from '../../services/download.service';
import { PromptService } from '../../services/prompt.service';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * The controller for the learn statistics page.
 */
@Component({
  selector: 'statistics-compare-view',
  templateUrl: './statistics-compare-view.component.html'
})
export class StatisticsCompareViewComponent {

  /** The available chart display modes. */
  chartModes: any = {
    SINGLE_FINAL: 0,
    SINGLE_COMPLETE: 1,
    MULTIPLE_FINAL: 2,
    MULTIPLE_COMPLETE: 3
  };

  /**
   * Make the chart mode dictionary available in the view.
   * Per default, display the cumulated charts.
   */
  chartMode: number;

  /** The list of test result nos that are used for the chart. */
  testNos: number[] = [];

  /** The data to fill the charts. */
  chartData: any;

  /** If the charts should be shown in two columns. */
  showInColumns: boolean;

  constructor(private appStore: AppStoreService,
              private learnerResultApi: LearnerResultApiService,
              private learnerResultChartService: LearnerResultChartService,
              private toastService: ToastService,
              private currentRoute: ActivatedRoute,
              private downloadService: DownloadService,
              private promptService: PromptService) {

    currentRoute.paramMap.subscribe(map => {
      this.testNos = map.get('testNos').split(',').map(t => Number(t));
      this.chartMode = this.testNos.length > 1 ? this.chartModes.MULTIPLE_FINAL : this.chartModes.SINGLE_FINAL;
      this.showInColumns = true;
      this.createChartData();
    });
  }

  get project(): Project {
    return this.appStore.project;
  }

  /**
   * Create chart data for the given mode and learn results.
   */
  createChartData(): void {
    this.chartData = null;

    switch (this.chartMode) {
      case this.chartModes.SINGLE_FINAL:
        this.learnerResultApi.get(this.project.id, this.testNos[0]).subscribe(result => {
          this.chartData = this.learnerResultChartService.createDataSingleFinal(result);
        });
        break;
      case this.chartModes.SINGLE_COMPLETE:
        this.learnerResultApi.get(this.project.id, this.testNos[0]).subscribe(result => {
          this.chartData = this.learnerResultChartService.createDataSingleComplete(result);
        });
        break;
      case this.chartModes.MULTIPLE_FINAL:
        this.learnerResultApi.getAll(this.project.id).subscribe(results => {

          // get all results and filter because there is still no other api endpoint
          const resultsFromTestNos = results.filter(r => this.testNos.indexOf(r.testNo) > -1);
          this.chartData = this.learnerResultChartService.createDataMultipleFinal(resultsFromTestNos);
        });
        break;
      case this.chartModes.MULTIPLE_COMPLETE:
        this.learnerResultApi.getAll(this.project.id).subscribe(results => {

          // get all results and filter because there is still no other api endpoint
          const resultsFromTestNos = results.filter(r => this.testNos.indexOf(r.testNo) > -1);
          this.chartData = this.learnerResultChartService.createDataMultipleComplete(resultsFromTestNos);
        });
        break;
      default:
        break;
    }
  }

  /** Switch the view to final. */
  switchToFinal(): void {
    switch (this.chartMode) {
      case this.chartModes.SINGLE_COMPLETE:
        this.chartMode = this.chartModes.SINGLE_FINAL;
        break;
      case this.chartModes.MULTIPLE_COMPLETE:
        this.chartMode = this.chartModes.MULTIPLE_FINAL;
        break;
      default:
        break;
    }
    this.createChartData();
  }

  /** Switch the view to complete. */
  switchToComplete(): void {
    switch (this.chartMode) {
      case this.chartModes.SINGLE_FINAL:
        this.chartMode = this.chartModes.SINGLE_COMPLETE;
        break;
      case this.chartModes.MULTIPLE_FINAL:
        this.chartMode = this.chartModes.MULTIPLE_COMPLETE;
        break;
      default:
        break;
    }
    this.createChartData();
  }

  /** Toggle the layout of the charts. */
  toggleShowInColumns(): void {
    this.showInColumns = !this.showInColumns;

    // adjust the size of the charts
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  /**
   * Download the chart as svg.
   *
   * @param selector The selector of the svg.
   */
  downloadChart(selector: string): void {
    const el = document.querySelector(selector + ' svg');
    this.promptService.prompt('Enter a name for the svg file')
      .then(filename => this.downloadService.downloadSvg(el, filename));
  }

  /** Reformat X Values to avoid floating point numbers to be displayed. */
  formatXTicks(value) {

    if (value % 1 !== 0) {
      return '';
    }

    return 'Step ' + Math.trunc(value);
  }
}
