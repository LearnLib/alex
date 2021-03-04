/*
 * Copyright 2015 - 2021 TU Dortmund
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

import { ToastService } from '../../services/toast.service';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LearnerSetupApiService } from '../../services/api/learner-setup-api.service';
import { LearnerSetup } from '../../entities/learner-setup';

/**
 * The controller that handles the preparation of a learn process. Lists all symbol groups and its visible symbols.
 */
@Component({
  selector: 'learner-setups-view',
  templateUrl: './learner-setups-view.component.html'
})
export class LearnerSetupsViewComponent {

  learnerSetups: LearnerSetup[] = [];

  constructor(private appStore: AppStoreService,
              private toastService: ToastService,
              private learnerSetupApi: LearnerSetupApiService,
              private router: Router) {

    this.learnerSetupApi.getAll(this.project.id).subscribe(
      learnerSetups => this.learnerSetups = learnerSetups,
      console.error
    );
  }

  deleteSetup(setup: LearnerSetup): void {
    this.learnerSetupApi.remove(this.project.id, setup.id).subscribe(
      () => {
        this.toastService.success('The setup has been deleted.');
        this.learnerSetups = this.learnerSetups.filter(ls => ls.id !== setup.id);
      },
      console.error
    );
  }

  copySetup(setup: LearnerSetup): void {
    this.learnerSetupApi.copy(this.project.id, setup.id).subscribe(
      copiedSetup => {
        this.toastService.success('The setup has been copied.');
        this.learnerSetups.push(copiedSetup);
      },
      console.error
    );
  }

  runSetup(setup: LearnerSetup): void {
    this.learnerSetupApi.run(this.project.id, setup.id).subscribe(
      result => {
        this.toastService.success('Learner process started successfully.');
        this.router.navigate(['/app', 'projects', this.project.id, 'learner'], {
          queryParams: {
            testNo: result.testNo
          }
        });
      },
      res => {
        this.toastService.danger('The learning process could not be started. ' +  res.error.message);
      }
    );
  }

  get project(): Project {
    return this.appStore.project;
  }
}
