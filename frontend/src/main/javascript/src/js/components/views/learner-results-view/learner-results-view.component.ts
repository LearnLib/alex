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

import * as remove from 'lodash/remove';
import {Selectable} from '../../../utils/selectable';
import {ProjectService} from '../../../services/project.service';
import {LearnResultResource} from '../../../services/resources/learner-result-resource.service';
import {PromptService} from '../../../services/prompt.service';
import {ToastService} from '../../../services/toast.service';
import {LearnerResultDownloadService} from '../../../services/learner-result-download.service';
import {LearnResult} from '../../../entities/learner-result';
import {Project} from '../../../entities/project';

/**
 * The controller for listing all final test results.
 */
class ResultsViewComponent {

  /** All final test results of a project. */
  public results: LearnResult[];

  /** The test results the user selected. */
  public selectedResults: Selectable<LearnResult>;

  /**
   * Constructor.
   *
   * @param $state
   * @param projectService
   * @param learnResultResource
   * @param promptService
   * @param toastService
   * @param learnerResultDownloadService
   * @param $uibModal
   */
  /* @ngInject */
  constructor(private $state: any,
              private projectService: ProjectService,
              private learnResultResource: LearnResultResource,
              private promptService: PromptService,
              private toastService: ToastService,
              private learnerResultDownloadService: LearnerResultDownloadService,
              private $uibModal: any) {

    this.results = [];
    this.selectedResults = new Selectable(this.results, 'testNo');

    // get all final test results
    this.learnResultResource.getAll(this.project.id)
      .then(results => {
        this.results = results;
        this.selectedResults = new Selectable(this.results, 'testNo');
      })
      .catch(err => console.log(err));
  }

  /**
   * Deletes a test result from the server after prompting the user for confirmation.
   *
   * @param result The test result that should be deleted.
   */
  deleteResult(result: LearnResult): void {
    this.promptService.confirm('Do you want to permanently delete this result? Changes cannot be undone.')
      .then(() => {
        this.learnResultResource.remove(result)
          .then(() => {
            this.toastService.success('Learn result for test <strong>' + result.testNo + '</strong> deleted');
            remove(this.results, {testNo: result.testNo});
            this.selectedResults.unselect(result);
          })
          .catch(err => {
            this.toastService.danger('<p><strong>Result deletion failed</strong></p>' + err.data.message);
          });
      });
  }

  /**
   * Deletes selected test results from the server after prompting the user for confirmation.
   */
  deleteResults(): void {
    const selectedResults = this.selectedResults.getSelected();
    if (selectedResults.length > 0) {
      this.promptService.confirm('Do you want to permanently delete theses results? Changes cannot be undone.')
        .then(() => {
          this.learnResultResource.removeMany(selectedResults)
            .then(() => {
              this.toastService.success('Learn results deleted');
              selectedResults.forEach(result => remove(this.results, {testNo: result.testNo}));
              this.selectedResults.unselectAll();
            })
            .catch(err => {
              this.toastService.danger('<p><strong>Result deletion failed</strong></p>' + err.data.message);
            });
        });
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
    const testNos = selectedResults.map(r => r.testNo).join(',');
    this.$state.go('learnerResultsStatistics', {testNos, projectId: this.project.id});
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
    this.learnResultResource.clone(result)
      .then(clonedResult => {
        this.toastService.success('The result has been cloned.');
        this.results.push(clonedResult);
      })
      .catch(err => {
        this.toastService.danger(`The result could not be cloned. ${err.data.message}`);
      });
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
    return this.projectService.store.currentProject;
  }
}

export const resultsViewComponent = {
  controller: ResultsViewComponent,
  controllerAs: 'vm',
  template: require('./learner-results-view.component.html')
};
