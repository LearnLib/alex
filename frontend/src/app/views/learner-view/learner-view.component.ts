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
    return this.currentResult != null && ([LearnerResultStatus.FINISHED, LearnerResultStatus.ABORTED].includes(this.currentResult.status));
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.symbolApi.getAll(this.project.id).subscribe(
      symbols => this.symbols = symbols,
      console.error
    );

    this.currentRoute.queryParamMap.subscribe(params => {
      if (params.has('testNo')) {
        const testNo = Number(params.get('testNo'));

        this.learnerResultApi.get(this.project.id, testNo).subscribe(
          result => {
            this.currentResult = result;

            switch (result.status) {
              case LearnerResultStatus.PENDING:
                this.toastService.info(`The learning process <strong>Test ${result.testNo}</strong> has been queued.`);
                this.router.navigate(['/app', 'projects', this.project.id, 'learner', 'setups']);
                break;
              case LearnerResultStatus.FINISHED:
                this.updateResumeConfig();
                break;
              default:
                this.poll();
            }
          }
        );
      } else {
        this.router.navigate(['/app', 'projects', this.project.id, 'learner', 'setups']);
      }
    });
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
      },
      console.error
    );
  }

  /**
   * Tell the server to continue learning with the new or old learn configuration when eqOracle type was 'sample'.
   */
  resumeLearning(): void {
    const config = JSON.parse(JSON.stringify(this.resumeConfig));
    config.symbolsToAdd.forEach(ps => ps.symbol = {id: ps.symbol.id});

    this.learnerApi.resume(this.project.id, this.currentResult.testNo, config).subscribe(
      result => {
        this.currentResult = result;
        this.status = null;
        this.poll();
      },
      res => {
        this.toastService.danger('<p><strong>Resume learning failed!</strong></p>' + res.error.message);
      }
    );
  }

  abort(): void {
    this.learnerApi.stop(this.project.id, this.currentResult.testNo).subscribe(
      () => {},
      console.error
    );
  }

  canAbort() {
    return this.currentResult.executedBy == null
            || this.appStore.user.id === this.currentResult.executedBy.id
            || this.appStore.project.owners.includes(this.appStore.user.id);
  }
}
