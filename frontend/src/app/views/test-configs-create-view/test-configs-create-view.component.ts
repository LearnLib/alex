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

import { Component, OnInit } from '@angular/core';
import { AppStoreService } from '../../services/app-store.service';
import { Project } from '../../entities/project';
import { LearnerSetupApiService } from '../../services/api/learner-setup-api.service';
import { LearnerSetup } from '../../entities/learner-setup';
import { ToastService } from '../../services/toast.service';
import { LearnerApiService } from '../../services/api/learner-api.service';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt.service';
import { TestConfigApiService } from "../../services/api/test-config-api.service";
import { TestSelectTreeStore } from "../../common/test-select-tree/test-select-tree.store";

@Component({
  selector: 'test-configs-create-view',
  templateUrl: './test-configs-create-view.component.html'
})
export class TestConfigsCreateViewComponent implements OnInit {

  config: any;

  constructor(private appStore: AppStoreService,
              private testConfigApi: TestConfigApiService,
              private toastService: ToastService,
              private router: Router,
              private store: TestSelectTreeStore) {
  }

  ngOnInit() {
    this.store.load([]);
    this.config = {};
    this.config.driverConfig = {};
    this.config.tests = {};
  }

  createTestConfig(): void {
    this.config.tests = this.store.testsSelectable.getSelected().filter(test => test.type === 'case').map(test => test.id);
    this.testConfigApi.create(this.appStore.project.id, this.config).subscribe(
      () => {
        this.toastService.success('The test config has been saved.');
        this.router.navigate(['/app', 'projects', this.appStore.project.id, 'tests', 'configs']);
      },
      res => this.toastService.danger(`The config could not be saved. ${res.error.message}`)
    );
  }

  get canCreateTestConfig(): boolean {
    return !(this.config == null
      || this.config.driverConfig.browser == null
      || this.config.driverConfig.platform == null);
  }

}
