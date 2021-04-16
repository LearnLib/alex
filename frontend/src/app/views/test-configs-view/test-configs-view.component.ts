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

import { Component } from "@angular/core";
import { AppStoreService } from "../../services/app-store.service";
import { TestConfigApiService } from "../../services/api/test-config-api.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: 'test-configs-view',
  templateUrl: './test-configs-view.component.html'
})
export class TestConfigsViewComponent {

  testConfigs: any[] = [];

  constructor(private appStore: AppStoreService,
              private testConfigApi: TestConfigApiService,
              private toastService: ToastService) {

    this.testConfigApi.getAll(this.appStore.project.id).subscribe(
      testConfigs => this.testConfigs = testConfigs,
      console.error
    );
  }

  deleteConfig(config: any): void {
    this.testConfigApi.remove(this.appStore.project.id, config.id).subscribe(
      () => {
        this.toastService.success('The config has been deleted.');
        this.testConfigs = this.testConfigs.filter(tc => tc.id !== config.id);
      },
      console.error
    );
  }

  copyConfig(config: any): void {
    this.testConfigApi.copy(this.appStore.project.id, config.id).subscribe(
      copiedConfig => {
        this.toastService.success('The config has been copied.');
        this.testConfigs.push(copiedConfig);
      },
      console.error
    );
  }

  runConfig(config: any): void {
    this.testConfigApi.run(this.appStore.project.id, config.id).subscribe(
      () => {
        this.toastService.success('The test process started successfully.');
      },
      res => {
        this.toastService.danger('The test process could not be started. ' + res.error.message);
      }
    );

  }
}
