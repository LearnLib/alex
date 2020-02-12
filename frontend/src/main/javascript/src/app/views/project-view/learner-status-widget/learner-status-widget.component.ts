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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from '../../../entities/project';
import { LearnerApiService } from '../../../services/api/learner-api.service';
import { ToastService } from '../../../services/toast.service';
import { AppStoreService } from '../../../services/app-store.service';
import { LearnerStatus } from '../../../entities/learner-status';

@Component({
  selector: 'learner-status-widget',
  templateUrl: './learner-status-widget.component.html'
})
export class LearnerStatusWidgetComponent implements OnInit, OnDestroy {

  private readonly INTERVAL_TIME = 5000;

  /** The status of the learner. */
  status: LearnerStatus;

  /** The interval handle. */
  private intervalHandle: number;

  constructor(private learnerApi: LearnerApiService,
              private toastService: ToastService,
              private appStore: AppStoreService) {
  }

  ngOnInit(): void {
    this.intervalHandle = window.setInterval(() => this.getStatus(), this.INTERVAL_TIME);
    this.getStatus();
  }

  ngOnDestroy(): void {
    window.clearInterval(this.intervalHandle);
  }

  /**
   * Induces the Learner to stop learning after the current hypothesis model.
   */
  abort(testNo: number): void {
    this.learnerApi.stop(this.project.id, testNo).subscribe(
      () => this.toastService.info('The learner stops the process as soon as possible.'),
      console.error
    );
  }

  private getStatus(): void {
    this.learnerApi.getStatus(this.project.id).subscribe(
      status => this.status = status,
      console.error
    );
  }

  get project(): Project {
    return this.appStore.project;
  }
}
