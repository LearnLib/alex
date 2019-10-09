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

import { LearnResult } from '../../../entities/learner-result';
import { LearnerApiService } from '../../../services/resources/learner-api.service';
import { LearnerResultApiService } from '../../../services/resources/learner-result-api.service';
import { ToastService } from '../../../services/toast.service';
import { SymbolApiService } from '../../../services/resources/symbol-api.service';
import { NotificationService } from '../../../services/notification.service';
import { AlphabetSymbol } from '../../../entities/alphabet-symbol';
import { IPromise } from 'angular';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The controller for showing a load screen during the learning and shows all learn results from the current test
 * in the intermediate steps.
 */
class LearnerViewComponentComponent {

  /** The interval that is used for polling. */
  public intervalHandle: IPromise<any>;

  /** The interval time for polling. */
  public intervalTime: number;

  /** The current step number. */
  public stepNo: number;

  /** The resume configuration. */
  public resumeConfig: any;

  /** The symbols. */
  public symbols: AlphabetSymbol[];

  /** The current learner status. */
  public status: any;

  /** The final learner result of the process. */
  public finalResult: LearnResult;

  /** If the learning process finished. */
  public finished: boolean;

  /* @ngInject */
  constructor(private $state: any,
              private $interval: any,
              private appStore: AppStoreService,
              private learnerApi: LearnerApiService,
              private learnerResultApi: LearnerResultApiService,
              private toastService: ToastService,
              private symbolApi: SymbolApiService,
              private notificationService: NotificationService) {

    this.intervalHandle = null;
    this.intervalTime = 5000;
    this.stepNo = 1;
    this.resumeConfig = null;
    this.symbols = [];
    this.status = null;
    this.finalResult = null;
    this.finished = false;

    this.symbolApi.getAll(this.project.id).subscribe(
      symbols => this.symbols = symbols,
      console.error
    );

    if (this.$state.params.result != null) {
      this.finished = true;
      this.finalResult = this.$state.params.result;
      this.stepNo = this.finalResult.steps.length;

      this.resumeConfig = {
        eqOracle: this.finalResult.steps[this.stepNo - 1].eqOracle,
        maxAmountOfStepsToLearn: this.finalResult.steps[this.stepNo - 1].stepsToLearn,
        stepNo: this.stepNo,
        symbolsToAdd: [],
        project: this.project.id,
        environments: this.finalResult.environments,
      };
    } else {
      this.poll();
    }
  }

  $onDestroy(): void {
    if (this.intervalHandle != null) {
      this.$interval.cancel(this.intervalHandle);
    }
  }

  /**
   * Checks every x seconds if the server has finished learning and sets the test if he did.
   */
  poll(): void {
    this.finished = false;
    this.getStatus();
    this.intervalHandle = this.$interval(() => this.getStatus(), this.intervalTime);
  }

  getStatus(): void {
    this.learnerApi.getStatus(this.project.id).subscribe(
      status => {
        this.status = status;
        if (this.status.result != null) {
          const now = new Date();
          const start = new Date(this.status.result.statistics.startDate);
          this.status.result.statistics.duration.total = (<any> now) - (<any> start);
        }

        if (!this.status.active) {
          this.finished = true;

          this.learnerResultApi.getLatest(this.project.id).subscribe(
            latestResult => {
              if (latestResult.error) {
                this.$state.go('error', {message: latestResult.errorText});
              } else {
                this.finalResult = latestResult;

                const lastStep = this.finalResult.steps[this.finalResult.steps.length - 1];
                this.resumeConfig = {
                  eqOracle: lastStep.eqOracle,
                  maxAmountOfStepsToLearn: lastStep.stepsToLearn,
                  stepNo: lastStep.stepNo,
                  symbolsToAdd: [],
                  project: this.project.id,
                  environments: this.finalResult.environments
                };
              }

              this.toastService.success('The learning process finished');
              this.notificationService.notify('ALEX has finished learning the application.');
            },
            console.error
          );

          this.$interval.cancel(this.intervalHandle);
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
    config.environments = config.environments.map(e => e.id);
    config.symbolsToAdd.forEach(ps => ps.symbol = {id: ps.symbol.id});

    this.learnerApi.resume(this.project.id, this.finalResult.testNo, config).subscribe(
      () => {
        this.finalResult = null;
        this.stepNo = this.resumeConfig.stepNo;
        this.status = null;
        this.poll();
      },
      err => {
        this.toastService.danger('<p><strong>Resume learning failed!</strong></p>' + err.data.message);
      }
    );
  }

  /**
   * Tell the learner to stop learning at the next possible time, when the next hypothesis is generated.
   */
  abort(): void {
    if (this.status.active) {
      this.toastService.info('The learner will stop after executing the current query batch');
      this.learnerApi.stop(this.project.id);
    }
  }

  get project(): Project {
    return this.appStore.project;
  }
}

export const learnerViewComponent = {
  controller: LearnerViewComponentComponent,
  controllerAs: 'vm',
  template: require('html-loader!./learner-view.component.html')
};
