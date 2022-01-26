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
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { TestConfigApiService } from '../../services/api/test-config-api.service';
import { TestSelectTreeStore } from '../../common/test-select-tree/test-select-tree.store';
import { TestConfigsCreateEditView } from './test-configs-create-edit-view';

@Component({
  selector: 'test-configs-create-view',
  templateUrl: './test-configs-create-view.component.html'
})
export class TestConfigsCreateViewComponent extends TestConfigsCreateEditView implements OnInit {

  constructor(private appStore: AppStoreService,
              private testConfigApi: TestConfigApiService,
              private toastService: ToastService,
              private router: Router,
              protected store: TestSelectTreeStore) {
    super(store);
  }

  ngOnInit() {
    this.store.load([]);
  }

  createTestConfig(): void {
    this.config.tests = this.store.testsSelectable.getSelected()
      .filter(test => test.type === 'case')
      .map(test => test.id);

    this.testConfigApi.create(this.appStore.project.id, this.config).subscribe(
      () => {
        this.toastService.success('The test config has been saved.');
        this.router.navigate(['/app', 'projects', this.appStore.project.id, 'tests', 'configs']);
      },
      res => this.toastService.danger(`The config could not be saved. ${res.error.message}`)
    );
  }
}
