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

import {LearnResult} from '../../../entities/learner-result';
import {ProjectService} from '../../../services/project.service';
import {LearnerResource} from '../../../services/resources/learner-resource.service';
import {LearnResultResource} from '../../../services/resources/learner-result-resource.service';
import {ToastService} from '../../../services/toast.service';
import {SymbolResource} from '../../../services/resources/symbol-resource.service';
import {NotificationService} from '../../../services/notification.service';
import {AlphabetSymbol} from '../../../entities/alphabet-symbol';
import {IPromise} from 'angular';
import {Project} from '../../../entities/project';

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

  /**
   * Constructor.
   *
   * @param $state
   * @param $interval
   * @param projectService
   * @param learnerResource
   * @param learnResultResource
   * @param toastService
   * @param symbolResource
   * @param notificationService
   */
  /* @ngInject */
  constructor(private $state: any,
              private $interval: any,
              private projectService: ProjectService,
              private learnerResource: LearnerResource,
              private learnResultResource: LearnResultResource,
              private toastService: ToastService,
              private symbolResource: SymbolResource,
              private notificationService: NotificationService) {

    this.intervalHandle = null;
    this.intervalTime = 5000;
    this.stepNo = 1;
    this.resumeConfig = null;
    this.symbols = [];
    this.status = null;
    this.finalResult = null;
    this.finished = false;

    this.symbolResource.getAll(this.project.id)
      .then(symbols => this.symbols = symbols)
      .catch(console.error);

    if (this.$state.params.result !== null) {
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
    this.learnerResource.getStatus(this.project.id)
      .then(status => {
        this.status = status;
        if (this.status.result != null) {
          const now = new Date();
          const start = new Date(this.status.result.statistics.startDate);
          this.status.result.statistics.duration.total = (<any> now) - (<any> start);
        }

        if (!this.status.active) {
          this.finished = true;

          this.learnResultResource.getLatest(this.project.id)
            .then(latestResult => {
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
            })
            .catch(console.error);

          this.$interval.cancel(this.intervalHandle);
        }
      })
      .catch(console.error);
  }

  /**
   * Tell the server to continue learning with the new or old learn configuration when eqOracle type was 'sample'.
   */
  resumeLearning(): void {
    const config = JSON.parse(JSON.stringify(this.resumeConfig));
    config.urls = this.resumeConfig.urls.map(u => u.id);
    config.symbolsToAdd.forEach(ps => ps.symbol = {id: ps.symbol.id});

    this.learnerResource.resume(this.project.id, this.finalResult.testNo, config)
      .then(() => {
        this.finalResult = null;
        this.stepNo = this.resumeConfig.stepNo;
        this.status = null;
        this.poll();
      })
      .catch(err => {
        this.toastService.danger('<p><strong>Resume learning failed!</strong></p>' + err.data.message);
      });
  }

  /**
   * Tell the learner to stop learning at the next possible time, when the next hypothesis is generated.
   */
  abort(): void {
    if (this.status.active) {
      this.toastService.info('The learner will stop after executing the current query batch');
      this.learnerResource.stop(this.project.id);
    }
  }

  get project(): Project {
    return this.projectService.store.currentProject;
  }
}

export const learnerViewComponent = {
  controller: LearnerViewComponentComponent,
  controllerAs: 'vm',
  template: require('./learner-view.component.html')
};
