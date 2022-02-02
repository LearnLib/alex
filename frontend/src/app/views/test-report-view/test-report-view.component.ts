/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { TestReportApiService } from '../../services/api/test-report-api.service';
import { ToastService } from '../../services/toast.service';
import { TestReportService } from '../../services/test-report.service';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestReportStatus, TestStatus } from '../../entities/test-status';
import { TestApiService } from '../../services/api/test-api.service';
import { combineLatest } from 'rxjs';
import { TestCase } from '../../entities/test-case';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../common/modals/confirm-modal/confirm-modal.component';

/**
 * The component for a single test report.
 */
@Component({
  selector: 'test-report-view',
  templateUrl: './test-report-view.component.html'
})
export class TestReportViewComponent implements OnInit {

  /** The report. */
  report: any;

  status: TestStatus;

  testCases: TestCase[] = [];

  testResults = {};

  private readonly pollReportInterval = 5000;

  constructor(private testApi: TestApiService,
              private testReportApi: TestReportApiService,
              private appStore: AppStoreService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private testReportService: TestReportService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: map => this.loadReport(Number(map.get('reportId')))
    });
  }

  /** Deletes the report. */
  deleteReport(): void {
    const modal = this.modalService.open(ConfirmModalComponent);
    modal.componentInstance.text = 'Do you really want to delete this report?';
    modal.result.then(() => {
      this.testReportApi.remove(this.project.id, this.report.id).subscribe({
        next: () => {
          this.toastService.success('The report has been deleted.');
          this.router.navigate(['/app', 'projects', this.appStore.project.id, 'tests', 'reports']);
        },
        error: res => this.toastService.danger(`The report could not be deleted. ${res.error.message}`)
      });
    });
  }

  /** Download the report. */
  downloadReport(): void {
    this.testReportService.download(this.project.id, this.report.id);
  }

  /** Get a string that tells how many test runs there are in front of the queue. */
  getNumberOfTestRunsAheadText(): string {
    const num = this.status.testRunQueue.findIndex(i => i.report.id === this.report.id) + 1;
    return num === 1 ? 'There is 1 test run ahead.' : `There are ${num} test runs ahead.`;
  }

  private loadReport(reportId: number): void {
    combineLatest([
      this.testApi.getStatus(this.project.id),
      this.testReportApi.get(this.project.id, reportId)
    ])
      .subscribe({
        next: result => {
          this.status = result[0];
          this.report = result[1];

          // load executed tests in this test run once
          if (this.testCases.length === 0) {
            this.loadTests();
          }

          if (!this.isFinished) {
            // if the process is still active, update the temporary test results
            if (this.testRunIsActive()) {
              this.testResults = this.status.currentTestRun.results;
            }

            // re-evaluate the status of the test run again
            window.setTimeout(() => this.loadReport(reportId), this.pollReportInterval);
          } else {
            this.report.testResults.forEach(tr => {
              this.testResults[tr.test.id] = tr;
            });
          }
        },
        error: res => this.toastService.danger(`Failed to load the report. ${res.error.message}`)
      });
  }

  private loadTests(): void {
    const testIds: number[] = this.testRunIsActive()
      ? this.status.currentTestRun.config.tests
      : this.report.testResults.filter(tr => tr.type === 'case').map(tr => tr.test.id);

    if (testIds.length > 0) {
      this.testApi.getMany(this.project.id, testIds).subscribe({
        next: tests => this.testCases = this.getTestCasesFromTests(tests)
      });
    }
  }

  /** Check if the test run related to the current report is active. */
  private testRunIsActive(): boolean {
    return this.status != null
      && this.status.currentTestRun != null
      && this.status.currentTestRun.report.id === this.report.id;
  }

  /**
   * Flatten test cases in a tree of tests.
   *
   * @param tests The list of test cases or test suites
   */
  private getTestCasesFromTests(tests: any[]): any[] {
    let testCases = [];
    tests.forEach(test => {
      if (test.type === 'suite') {
        testCases = testCases.concat(this.getTestCasesFromTests(test.tests));
      } else {
        testCases.push(test);
      }
    });
    return testCases;
  }

  get project(): Project {
    return this.appStore.project;
  }

  get isFinished(): boolean {
    return this.report != null && ![TestReportStatus.IN_PROGRESS, TestReportStatus.PENDING].includes(this.report.status);
  }

  get isPending(): boolean {
    return this.report != null && this.report.status === TestReportStatus.PENDING;
  }

  get isInProgress(): boolean {
    return this.report != null && this.report.status === TestReportStatus.IN_PROGRESS;
  }
}
