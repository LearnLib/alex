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
import { ActivatedRoute, Router } from '@angular/router';
import { LearnerSetupApiService } from '../../services/api/learner-setup-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { LearnerSetup } from '../../entities/learner-setup';
import { ToastService } from '../../services/toast.service';
import { TestConfigApiService } from "../../services/api/test-config-api.service";
import { TestSelectTreeStore } from "../../common/test-select-tree/test-select-tree.store";

@Component({
  selector: 'test-configs-edit-view',
  templateUrl: './test-configs-edit-view.component.html'
})
export class TestConfigsEditViewComponent implements OnInit {

  config: any;

  constructor(private route: ActivatedRoute,
              private appStore: AppStoreService,
              private router: Router,
              private toastService: ToastService,
              private testConfigApi: TestConfigApiService,
              private store: TestSelectTreeStore) {
  }

ngOnInit() {
  this.route.paramMap.subscribe(
      params => {
        const configId = Number(params.get('configId'));
        this.testConfigApi.get(this.appStore.project.id, configId).subscribe(
          config => {
            this.store.load(config.tests.map(testId => ({ id: Number(testId) })));
            this.config = config;
          }
        );
      },
      console.error
    );
  }

updateConfig() {
    this.config.tests = this.store.testsSelectable.getSelected().filter(test => test.type === 'case').map(test => test.id);
    this.testConfigApi.update(this.appStore.project.id, this.config).subscribe(
      config => {
        this.toastService.success('The test config has been updated.');
        this.router.navigate(['/app', 'projects', this.appStore.project.id, 'tests', 'configs']);
      },
      res => this.toastService.danger(`The config could not be updated. ${res.error.message}`)
    );
  }

  get canUpdateTestConfig(): boolean {
    return !(this.config == null
      || this.config.driverConfig.browser == null
      || this.config.driverConfig.platform == null);
  }
}
