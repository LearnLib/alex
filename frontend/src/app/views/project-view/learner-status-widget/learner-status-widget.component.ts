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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from '../../../entities/project';
import { LearnerApiService } from '../../../services/api/learner-api.service';
import { ToastService } from '../../../services/toast.service';
import { AppStoreService } from '../../../services/app-store.service';
import { LearnerStatus } from '../../../entities/learner-status';
import { LearnerResult } from '../../../entities/learner-result';

@Component({
  selector: 'learner-status-widget',
  templateUrl: './learner-status-widget.component.html',
  styleUrls: ['./learner-status-widget.component.scss']
})
export class LearnerStatusWidgetComponent implements OnInit, OnDestroy {

  /** The status of the learner. */
  status: LearnerStatus;

  private readonly INTERVAL_TIME = 5000;

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
    this.learnerApi.stop(this.project.id, testNo).subscribe({
      next: () => this.toastService.info('The learner stops the process as soon as possible.'),
      error: console.error
    });
  }

  canAbort(result: LearnerResult) {
    return result.executedBy == null
      || this.appStore.user.id === result.executedBy.id
      || this.appStore.project.owners.includes(this.appStore.user.id);
  }

  private getStatus(): void {
    this.learnerApi.getStatus(this.project.id).subscribe({
      next: status => this.status = status,
      error: console.error
    });
  }

  get project(): Project {
    return this.appStore.project;
  }
}
