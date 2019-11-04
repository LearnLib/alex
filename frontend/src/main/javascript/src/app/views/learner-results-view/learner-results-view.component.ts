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

import { remove, orderBy } from 'lodash';
import { Selectable } from '../../utils/selectable';
import { LearnerResultApiService } from '../../services/api/learner-result-api.service';
import { ToastService } from '../../services/toast.service';
import { LearnerResultDownloadService } from '../../services/learner-result-download.service';
import { LearnerResult } from '../../entities/learner-result';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerResultDetailsModalComponent } from '../../common/modals/learner-result-details-modal/learner-result-details-modal.component';
import { Router } from '@angular/router';

/**
 * The controller for listing all final test results.
 */
@Component({
  selector: 'learner-results-view',
  templateUrl: './learner-results-view.component.html'
})
export class LearnerResultsViewComponent implements OnInit {

  /** All final test results of a project. */
  results: LearnerResult[];

  /** The test results the user selected. */
  selectedResults: Selectable<LearnerResult, number>;

  constructor(private appStore: AppStoreService,
              private learnerResultApi: LearnerResultApiService,
              private toastService: ToastService,
              private learnerResultDownloadService: LearnerResultDownloadService,
              private modalService: NgbModal,
              private router: Router) {

    this.results = [];
    this.selectedResults = new Selectable(this.results, r => r.testNo);
  }

  ngOnInit(): void {
    this.learnerResultApi.getAll(this.project.id).subscribe(
      results => {
        this.results = results;
        this.selectedResults.addItems(this.results);
      },
      console.error
    );
  }

  /**
   * Deletes a test result from the server.
   *
   * @param result The test result that should be deleted.
   */
  deleteResult(result: LearnerResult): void {
    this.learnerResultApi.remove(result).subscribe(
      () => {
        this.toastService.success('Learner result for test <strong>' + result.testNo + '</strong> deleted');
        remove(this.results, {testNo: result.testNo});
        this.selectedResults.unselect(result);
      },
      res => {
        this.toastService.danger('<p><strong>Could not delete learner result</strong></p>' + res.error.message);
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
          this.toastService.success('Learner results deleted');
          selectedResults.forEach(result => remove(this.results, {testNo: result.testNo}));
          this.selectedResults.unselectAll();
        },
        res => {
          this.toastService.danger('<p><strong>Could not delete learner results</strong></p>' + res.error.message);
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
      const ids = selectedResults.map(r => r.id).join(',');
      this.router.navigate(['/app', 'projects', this.project.id , 'learner', 'results', ids]);
    }
  }

  /**
   * Redirect to the statistics page for the selected results.
   */
  showSelectedStatistics(): void {
    const selectedResults = this.selectedResults.getSelected();
    if (selectedResults.length > 0) {
      const testNos = selectedResults.map(r => r.testNo).join(',');
      this.router.navigate(['/app', 'projects', this.project.id , 'learner', 'statistics', testNos]);
    }
  }

  showStatistics(result: LearnerResult): void {
    this.router.navigate(['/app', 'projects', this.project.id , 'learner', 'statistics', result.testNo]);
  }

  /**
   * Exports the statistics and some other attributes from a given learn result into csv.
   *
   * @param result The learn result to download as csv.
   */
  exportAsCSV(result: LearnerResult): void {
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

  cloneResult(result: LearnerResult): void {
    this.learnerResultApi.clone(result).subscribe(
      clonedResult => {
        this.toastService.success('The result has been cloned.');
        this.results.push(clonedResult);
        this.selectedResults.addItem(clonedResult);
      },
      res => {
        this.toastService.danger(`The result could not be cloned. ${res.error.message}`);
      }
    );
  }

  openResultDetailsModal(result: LearnerResult): void {
    const modalRef = this.modalService.open(LearnerResultDetailsModalComponent);
    modalRef.componentInstance.result = result;
    modalRef.componentInstance.current = null;
  }

  get project(): Project {
    return this.appStore.project;
  }

  get orderedResults(): LearnerResult[] {
    return orderBy(this.results, ['testNo'], ['desc']);
  }
}
