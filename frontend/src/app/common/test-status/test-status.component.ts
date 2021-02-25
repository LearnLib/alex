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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TestApiService } from '../../services/api/test-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { TestQueueItem, TestReport, TestReportStatus, TestStatus } from '../../entities/test-status';
import { Project } from '../../entities/project';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'test-status',
  templateUrl: './test-status.component.html',
  styleUrls: ['./test-status.component.scss']
})
export class TestStatusComponent implements OnInit, OnDestroy {

  @Input()
  flush = true;

  status: TestStatus;

  testReportStatus: any = TestReportStatus;

  private readonly INTERVAL_TIME = 3000;

  private interval: number;

  constructor(private appStore: AppStoreService,
              private testApi: TestApiService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.interval = window.setInterval(() => {
      this.getStatus();
    }, this.INTERVAL_TIME);
    this.getStatus();
  }

  ngOnDestroy(): void {
    window.clearInterval(this.interval);
  }

  canAbort(testReport: TestReport) {
    return [TestReportStatus.PENDING, TestReportStatus.IN_PROGRESS].includes(testReport.status)
            && (testReport.executedBy == null
                || this.appStore.user.id === testReport.executedBy.id
                || this.appStore.project.owners.includes(this.appStore.user.id));
  }

  abort(testReport: TestReport) {
    this.testApi.abort(this.project.id, testReport.id).subscribe(() => {
      this.toastService.success('The test run has been aborted');
    });
  }

  private getStatus(): void {
    this.testApi.getStatus(this.appStore.project.id).subscribe(status => {
      this.status = status;
    });
  }

  get allTestRuns(): TestQueueItem[] {
    return this.status == null ? [] : [this.status.currentTestRun, ...this.status.testRunQueue];
  }

  get project(): Project {
    return this.appStore.project;
  }
}
