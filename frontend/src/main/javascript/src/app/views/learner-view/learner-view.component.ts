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

import { LearnerResult } from '../../entities/learner-result';
import { LearnerApiService } from '../../services/api/learner-api.service';
import { LearnerResultApiService } from '../../services/api/learner-result-api.service';
import { ToastService } from '../../services/toast.service';
import { SymbolApiService } from '../../services/api/symbol-api.service';
import { NotificationService } from '../../services/notification.service';
import { AlphabetSymbol } from '../../entities/alphabet-symbol';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { ErrorViewStoreService } from '../error-view/error-view-store.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearnerViewStoreService } from './learner-view-store.service';

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
  public intervalHandle: number;

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
  public finalResult: LearnerResult;

  /** If the learning process finished. */
  public finished: boolean;

  constructor(private appStore: AppStoreService,
              private currentRoute: ActivatedRoute,
              private learnerApi: LearnerApiService,
              private learnerResultApi: LearnerResultApiService,
              private toastService: ToastService,
              private symbolApi: SymbolApiService,
              private notificationService: NotificationService,
              private errorViewStore: ErrorViewStoreService,
              public store: LearnerViewStoreService) {

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
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe(params => {
      if (params.has("testNo")) {
        const testNo = parseInt(params.get("testNo"));
        this.learnerResultApi.get(this.project.id, testNo).subscribe(
          result => {
            this.finalResult = result;
            this.finished = true;
            this.resumeConfig = {
              eqOracle: this.finalResult.steps[this.stepNo - 1].eqOracle,
              maxAmountOfStepsToLearn: this.finalResult.steps[this.stepNo - 1].stepsToLearn,
              stepNo: this.stepNo,
              symbolsToAdd: [],
              project: this.project.id,
              environments: this.finalResult.environments,
            };
          }
        )
      } else {
        this.poll();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalHandle != null) {
      window.clearInterval(this.intervalHandle);
    }
  }

  /**
   * Checks every x seconds if the server has finished learning and sets the test if he did.
   */
  poll(): void {
    this.finished = false;
    this.getStatus();
    this.intervalHandle = window.setInterval(() => this.getStatus(), this.intervalTime);
  }

  getStatus(): void {
    this.learnerApi.getStatus(this.project.id).subscribe(
      status => {
        this.status = status;
        if (this.status.result != null) {
          const now = new Date();
          const start = new Date(this.status.result.statistics.startDate as any);
          this.status.result.statistics.duration.total = (<any>now) - (<any>start);
        }

        if (!this.status.active) {
          this.finished = true;

          this.learnerResultApi.getLatest(this.project.id).subscribe(
            latestResult => {
              if (latestResult.error) {
                this.errorViewStore.navigateToErrorPage(latestResult.errorText);
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

          window.clearInterval(this.intervalHandle);
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
      res => {
        this.toastService.danger('<p><strong>Resume learning failed!</strong></p>' + res.error.message);
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
}
