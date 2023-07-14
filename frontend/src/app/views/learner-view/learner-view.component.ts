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

import { LearnerResult, LearnerResultStatus } from '../../entities/learner-result';
import { LearnerApiService } from '../../services/api/learner-api.service';
import { LearnerResultApiService } from '../../services/api/learner-result-api.service';
import { ToastService } from '../../services/toast.service';
import { SymbolApiService } from '../../services/api/symbol-api.service';
import { NotificationService } from '../../services/notification.service';
import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerViewStoreService } from './learner-view-store.service';
import { LearnerStatus } from '../../entities/learner-status';

/**
 * The controller for showing a load screen during the learning and shows all learn results from the current test
 * in the intermediate steps.
 */
@Component({
  selector: 'learner-view',
  templateUrl: './learner-view.component.html',
  providers: [LearnerViewStoreService]
})
export class LearnerViewComponent implements OnInit, OnDestroy {

  /** The interval that is used for polling. */
  intervalHandle: number;

  /** The resume configuration. */
  resumeConfig: any;

  /** The symbols. */
  symbols: AlphabetSymbol[];

  /** The final learner result of the process. */
  currentResult: LearnerResult;

  status: LearnerStatus;

  timeElapsed = 0;

  /** The interval time for polling. */
  private readonly INTERVAL_TIME = 5000;

  constructor(private appStore: AppStoreService,
              private currentRoute: ActivatedRoute,
              private learnerApi: LearnerApiService,
              private learnerResultApi: LearnerResultApiService,
              private toastService: ToastService,
              private router: Router,
              private symbolApi: SymbolApiService,
              private notificationService: NotificationService,
              public store: LearnerViewStoreService) {

    this.symbols = [];
  }

  get finished(): boolean {
    const finishedStatus = [LearnerResultStatus.FINISHED, LearnerResultStatus.ABORTED, LearnerResultStatus.FAILED];
    return this.currentResult != null && (finishedStatus.includes(this.currentResult.status));
  }

  get pending(): boolean {
    return this.currentResult != null && this.currentResult.status === LearnerResultStatus.PENDING;
  }

  get inProgress(): boolean {
    return this.currentResult != null && this.currentResult.status === LearnerResultStatus.IN_PROGRESS;
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.symbolApi.getAll(this.project.id).subscribe({
      next: symbols => this.symbols = symbols,
      error: console.error
    });

    this.currentRoute.queryParamMap.subscribe(params => {
      if (params.has('testNo')) {
        const testNo = Number(params.get('testNo'));
        this.fetchLearnerResultAndStartPolling(testNo);
      } else {
        this.router.navigate(['/app', 'projects', this.project.id, 'learner', 'setups']);
      }
    });
  }

  fetchLearnerResultAndStartPolling(testNo: number): void {
    this.learnerResultApi.get(this.project.id, testNo).subscribe(
      result => {
        this.currentResult = result;

        switch (result.status) {
          case LearnerResultStatus.PENDING:
            this.toastService.info(`The learning process <strong>Test ${result.testNo}</strong> has been queued.`);
            this.poll();
            break;
          case LearnerResultStatus.FINISHED:
            this.updateResumeConfig();
            break;
          default:
            this.poll();
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.intervalHandle != null) {
      window.clearInterval(this.intervalHandle);
    }
  }

  updateResumeConfig(): void {
    const lastStep = this.currentResult.steps[this.currentResult.steps.length - 1];
    this.resumeConfig = {
      eqOracle: lastStep.eqOracle,
      stepNo: lastStep.stepNo,
      symbolsToAdd: [],
    };
  }

  /**
   * Checks every x seconds if the server has finished learning and sets the test if he did.
   */
  poll(): void {
    this.intervalHandle = window.setInterval(() => this.getStatus(), this.INTERVAL_TIME);
    this.getStatus();
  }

  getStatus(): void {
    this.learnerApi.getStatus(this.project.id).subscribe(
      status => {
        this.status = status;
        this.timeElapsed = new Date().getTime() - new Date(this.currentResult.statistics.startDate).getTime();

        if (status.active && status.currentProcess.result.testNo === this.currentResult.testNo) {
          this.currentResult = status.currentProcess.result;
        } else {
          this.learnerResultApi.get(this.project.id, this.currentResult.testNo).subscribe(result => {
            this.currentResult = result;
            this.updateResumeConfig();
            window.clearInterval(this.intervalHandle);
            this.toastService.success('The learning process finished');
            this.notificationService.notify('ALEX has finished learning the application.');
          });
        }
      }
    );
  }

  /**
   * Tell the server to continue learning with the new or old learn configuration when eqOracle type was 'sample'.
   */
  resumeLearning(): void {
    const config = JSON.parse(JSON.stringify(this.resumeConfig));
    config.symbolsToAdd.forEach(ps => ps.symbol = {id: ps.symbol.id});

    this.learnerApi.resume(this.project.id, this.currentResult.testNo, config).subscribe({
      next: result => {
        this.currentResult = null;
        this.status = null;
        this.fetchLearnerResultAndStartPolling(result.testNo);
      },
      error: res => {
        this.toastService.danger('<p><strong>Resume learning failed!</strong></p>' + res.error.message);
      }
    });
  }

  abort(): void {
    this.learnerApi.stop(this.project.id, this.currentResult.id).subscribe({
      next: () => this.toastService.info('The process has been aborted and will terminate as soon as possible.'),
      error: res => {
        this.toastService.danger('<p><strong>The process could not be stopped.</strong></p>' + res.error.message);
      }
    });
  }

  canAbort() {
    return this.currentResult.executedBy == null
            || this.appStore.user.id === this.currentResult.executedBy.id
            || this.appStore.project.owners.includes(this.appStore.user.id);
  }
}
