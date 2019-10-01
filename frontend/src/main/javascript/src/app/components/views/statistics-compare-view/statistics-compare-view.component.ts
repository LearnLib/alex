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

import { LearnResultResource } from '../../../services/resources/learner-result-resource.service';
import { LearnerResultChartService } from '../../../services/learner-result-chart.service';
import { ToastService } from '../../../services/toast.service';
import { DownloadService } from '../../../services/download.service';
import { PromptService } from '../../../services/prompt.service';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The controller for the learn statistics page.
 */
class StatisticsCompareViewComponent {

  /** The available chart display modes. */
  public chartModes: any = {
    SINGLE_FINAL: 0,
    SINGLE_COMPLETE: 1,
    MULTIPLE_FINAL: 2,
    MULTIPLE_COMPLETE: 3
  };

  /**
   * Make the chart mode dictionary available in the view.
   * Per default, display the cumulated charts.
   */
  public chartMode: number;

  /** The list of test result nos that are used for the chart. */
  public testNos: number[];

  /** The data to fill the charts. */
  public chartData: any;

  /** If the charts should be shown in two columns. */
  public showInColumns: boolean;

  /* @ngInject */
  constructor(private appStore: AppStoreService,
              private learnResultResource: LearnResultResource,
              private learnerResultChartService: LearnerResultChartService,
              private toastService: ToastService,
              private $stateParams: any,
              private $state: any,
              private downloadService: DownloadService,
              private promptService: PromptService) {

    // make sure there is at least one test number given in the URL
    if (!this.$stateParams.testNos || this.$stateParams.testNos === '') {
      this.toastService.danger('You have to select at least one result');
      this.$state.go('statistics');
      return;
    }

    this.testNos = this.$stateParams.testNos.split(',').map(t => Number.parseInt(t));
    this.chartMode = this.testNos.length > 1 ? this.chartModes.MULTIPLE_FINAL : this.chartModes.SINGLE_FINAL;
    this.chartData = {};
    this.showInColumns = true;

    // create the charts
    this.createChartData();
  }

  /**
   * Create chart data for the given mode and learn results.
   */
  createChartData(): void {
    switch (this.chartMode) {
      case this.chartModes.SINGLE_FINAL:
        this.learnResultResource.get(this.project.id, this.testNos[0])
          .then(result => {
            this.chartData = this.learnerResultChartService.createDataSingleFinal(result);
          });
        break;
      case this.chartModes.SINGLE_COMPLETE:
        this.learnResultResource.get(this.project.id, this.testNos[0])
          .then(result => {
            this.chartData = this.learnerResultChartService.createDataSingleComplete(result);
          });
        break;
      case this.chartModes.MULTIPLE_FINAL:
        this.learnResultResource.getAll(this.project.id).then(results => {

          // get all results and filter because there is still no other api endpoint
          const resultsFromTestNos = results.filter(r => this.testNos.indexOf(r.testNo) > -1);
          this.chartData = this.learnerResultChartService.createDataMultipleFinal(resultsFromTestNos);
        });
        break;
      case this.chartModes.MULTIPLE_COMPLETE:
        this.learnResultResource.getAll(this.project.id).then(results => {

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
      .then(filename => this.downloadService.downloadSvgEl(el, false, filename));
  }

  get project(): Project {
    return this.appStore.project;
  }
}

export const statisticsCompareViewComponent = {
  controller: StatisticsCompareViewComponent,
  controllerAs: 'vm',
  template: require('html-loader!./statistics-compare-view.component.html')
};
