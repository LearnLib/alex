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

import { Component, OnInit } from '@angular/core';
import { AppStoreService } from '../../services/app-store.service';
import { Project } from '../../entities/project';
import { LearnerSetupApiService } from '../../services/api/learner-setup-api.service';
import { LearnerSetup } from '../../entities/learner-setup';
import { ToastService } from '../../services/toast.service';
import { LearnerApiService } from '../../services/api/learner-api.service';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { LearnerSetupsCreateEditView } from './learner-setups-create-edit-view';

@Component({
  selector: 'learner-setups-create-view',
  templateUrl: './learner-setups-create-view.component.html'
})
export class LearnerSetupsCreateViewComponent extends LearnerSetupsCreateEditView implements OnInit {

  constructor(private appStore: AppStoreService,
              private learnerSetupApi: LearnerSetupApiService,
              private toastService: ToastService,
              private learnerApi: LearnerApiService,
              private promptService: PromptService,
              private router: Router) {
    super();
  }

  ngOnInit() {
    this.setup = new LearnerSetup();
    this.setup.environments = [this.project.getDefaultEnvironment()];
  }

  saveLearnerSetup(): void {
    const setup = this.createLearnerSetup();
    this.learnerSetupApi.create(this.project.id, setup).subscribe(
      () => {
        this.toastService.success('The learner setup has been saved.');
        this.router.navigate(['/app', 'projects', this.project.id, 'learner', 'setups']);
      },
      res => this.toastService.danger(`The setup could not be saved. ${res.error.message}`)
    );
  }

  startLearning(): void {
    this.promptService.prompt('Enter a comment for the learning process', {
      required: false,
      okBtnText: 'Run',
    })
      .then(comment => {
        const config = {
          setup: this.createLearnerSetup(),
          options: {
            comment
          }
        };

        this.learnerApi.start(this.project.id, config).subscribe(
          result => {
            this.toastService.success('Learner process started successfully.');
            this.router.navigate(['/app', 'projects', this.project.id, 'learner'], {
              queryParams: {
                testNo: result.testNo
              }
            });
          },
          res => this.toastService.danger(`The process could not be started. ${res.error.message}`)
        );
      });
  }

  get project(): Project {
    return this.appStore.project;
  }

  private createLearnerSetup(): LearnerSetup {
    const setup = this.setup.copy();
    setup.symbols.forEach(ps => ps.symbol = {id: ps.symbol.id} as any);
    setup.preSymbol.symbol = {id: setup.preSymbol.symbol.id} as any;
    if (setup.postSymbol != null) {
      setup.postSymbol.symbol = {id: setup.postSymbol.symbol.id} as any;
    }
    return setup;
  }
}
