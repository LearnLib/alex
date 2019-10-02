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

import { remove } from 'lodash';
import { Selectable } from '../../../utils/selectable';
import { LearnerResultApiService } from '../../../services/resources/learner-result-api.service';
import { ToastService } from '../../../services/toast.service';
import { LearnerResultDownloadService } from '../../../services/learner-result-download.service';
import { LearnResult } from '../../../entities/learner-result';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The controller for listing all final test results.
 */
class ResultsViewComponent {

  /** All final test results of a project. */
  public results: LearnResult[];

  /** The test results the user selected. */
  public selectedResults: Selectable<LearnResult>;

  /* @ngInject */
  constructor(private $state: any,
              private appStore: AppStoreService,
              private learnerResultApi: LearnerResultApiService,
              private toastService: ToastService,
              private learnerResultDownloadService: LearnerResultDownloadService,
              private $uibModal: any) {

    this.results = [];
    this.selectedResults = new Selectable(this.results, 'testNo');

    // get all final test results
    this.learnerResultApi.getAll(this.project.id).subscribe(
      results => {
        this.results = results;
        this.selectedResults = new Selectable(this.results, 'testNo');
      },
      console.error
    );
  }

  /**
   * Deletes a test result from the server.
   *
   * @param result The test result that should be deleted.
   */
  deleteResult(result: LearnResult): void {
    this.learnerResultApi.remove(result).subscribe(
      () => {
        this.toastService.success('Learn result for test <strong>' + result.testNo + '</strong> deleted');
        remove(this.results, {testNo: result.testNo});
        this.selectedResults.unselect(result);
      },
      err => {
        this.toastService.danger('<p><strong>Could not delete learner result</strong></p>' + err.data.message);
      }
    );
  }

  /**
   * Deletes selected test results from the server.
   */
  deleteResults(): void {
    const selectedResults = this.selectedResults.getSelected();
    if (selectedResults.length > 0) {
      this.learnerResultApi.removeMany(selectedResults).subscribe(
        () => {
          this.toastService.success('Learn results deleted');
          selectedResults.forEach(result => remove(this.results, {testNo: result.testNo}));
          this.selectedResults.unselectAll();
        },
        err => {
          this.toastService.danger('<p><strong>Could not delete learner results</strong></p>' + err.data.message);
        }
      );
    } else {
      this.toastService.info('You have to select a least one result');
    }
  }

  /**
   * Opens the learning result compare view with the selected results opened.
   */
  openSelectedResults(): void {
    const selectedResults = this.selectedResults.getSelected();
    if (selectedResults.length > 0) {
      const testNos = selectedResults.map(r => r.testNo).join(',');
      this.$state.go('learnerResultsCompare', {testNos, projectId: this.project.id});
    }
  }

  /**
   * Redirect to the statistics page for the selected results.
   */
  showSelectedStatistics(): void {
    const selectedResults = this.selectedResults.getSelected();
    if (selectedResults.length > 0) {
      const testNos = selectedResults.map(r => r.testNo).join(',');
      this.$state.go('learnerResultsStatistics', {testNos, projectId: this.project.id});
    }
  }

  showStatistics(result: LearnResult): void {
    this.$state.go('learnerResultsStatistics', {testNos: '' + result.testNo, projectId: this.project.id});
  }

  /**
   * Exports the statistics and some other attributes from a given learn result into csv.
   *
   * @param result The learn result to download as csv.
   */
  exportAsCSV(result: LearnResult): void {
    this.learnerResultDownloadService.download([result])
      .then(() => this.toastService.success('The result has been exported.'));
  }

  /**
   * Exports selected learn results into a csv file.
   */
  exportSelectedAsCSV(): void {
    const selectedResults = this.selectedResults.getSelected();
    if (selectedResults.length > 0) {
      this.learnerResultDownloadService.download(selectedResults)
        .then(() => this.toastService.success('The results have been exported.'));
    }
  }

  cloneResult(result: LearnResult): void {
    this.learnerResultApi.clone(result).subscribe(
      clonedResult => {
        this.toastService.success('The result has been cloned.');
        this.results.push(clonedResult);
      },
      err => {
        this.toastService.danger(`The result could not be cloned. ${err.data.message}`);
      }
    );
  }

  openResultDetailsModal(result: LearnResult): void {
    this.$uibModal.open({
      component: 'learnerResultDetailsModal',
      resolve: {
        result: () => result,
        current: () => null
      }
    });
  }

  get project(): Project {
    return this.appStore.project;
  }
}

export const resultsViewComponent = {
  controller: ResultsViewComponent,
  controllerAs: 'vm',
  template: require('html-loader!./learner-results-view.component.html')
};
