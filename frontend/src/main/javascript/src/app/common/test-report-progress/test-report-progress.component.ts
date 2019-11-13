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

import { Component, Input } from '@angular/core';
import { AppStoreService } from '../../services/app-store.service';
import { ToastService } from '../../services/toast.service';
import { TestApiService } from '../../services/api/test-api.service';

@Component({
  selector: 'test-report-progress',
  templateUrl: './test-report-progress.component.html'
})
export class TestReportProgressComponent {

  @Input()
  report: any;

  constructor(public appStore: AppStoreService,
              private toastService: ToastService,
              private testApi: TestApiService) {
  }

  abort() {
    this.testApi.abort(this.appStore.project.id, this.report.id).subscribe(() => {
      this.toastService.success('The test run has been aborted');
    })
  }
}
