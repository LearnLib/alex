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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Project } from '../../../entities/project';
import { LearnerApiService } from '../../../services/api/learner-api.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'learner-status-widget',
  templateUrl: './learner-status-widget.component.html'
})
export class LearnerStatusWidgetComponent implements OnInit, OnDestroy {

  /** The current project. */
  @Input()
  public project: Project = null;

  /** The status of the learner. */
  public status: any = null;

  /** The interval handle. */
  public intervalHandle: number;

  constructor(private learnerApi: LearnerApiService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getStatus();
    this.intervalHandle = window.setInterval(() => this.getStatus(), 5000);
  }

  ngOnDestroy(): void {
    window.clearInterval(this.intervalHandle);
  }

  getStatus(): void {
    this.learnerApi.getStatus(this.project.id).subscribe(
      status => this.status = status,
      console.error
    );
  }

  /**
   * Induces the Learner to stop learning after the current hypothesis model.
   */
  abort(): void {
    this.learnerApi.stop(this.project.id).subscribe(
      () => this.toastService.info('The learner stops as soon as possible.'),
      console.error
    );
  }
}
