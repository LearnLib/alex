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

import { LearnerResult } from '../../../../entities/learner-result';
import { LearnerResultApiService } from '../../../../services/api/learner-result-api.service';
import { ToastService } from '../../../../services/toast.service';
import { TestApiService } from '../../../../services/api/test-api.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'test-suite-generation-widget',
  templateUrl: './test-suite-generation-widget.component.html'
})
export class TestSuiteGenerationWidgetComponent implements OnInit {

  /** The current learner result. */
  @Input()
  result: LearnerResult;

  /** The current step number. */
  @Input()
  stepNo: number;

  /** The config to use for the generation. */
  config: any;

  rootTestSuite: any;
  selectedTestSuite: any;

  constructor(private learnerResultApi: LearnerResultApiService,
              private toastService: ToastService,
              private testApi: TestApiService) {
    this.result = null;
    this.config = {
      stepNo: 0,
      includeParameterValues: true,
      name: '',
      method: 'DT'
    };
  }

  ngOnInit(): void {
    this.config.stepNo = this.stepNo + 1;
    this.config.name = `TestNo ${this.result.testNo} (Generated)`;
    this.loadRootTestSuite();
  }

  loadRootTestSuite() {
    this.testApi.getRoot(this.result.project).subscribe(
      root => this.rootTestSuite = root
    );
  }

  handleTestSuiteSelected(testSuite) {
    if (this.selectedTestSuite == null) {
      this.selectedTestSuite = testSuite;
    } else if (this.selectedTestSuite.id === testSuite.id) {
      this.selectedTestSuite = null;
    } else {
      this.selectedTestSuite = testSuite;
    }
  }

  generateTestSuite(): void {
    if (this.config.name.trim() === '') {
      this.toastService.danger(`The name may not be empty`);
      return;
    }

    if (this.selectedTestSuite != null) {
      this.config.testSuiteToUpdateId = this.selectedTestSuite.id;
    }

    this.learnerResultApi.generateTestSuite(this.result.project, this.result.testNo, this.config).subscribe(
      () => {
        this.loadRootTestSuite();
        this.toastService.success('The test suite has been generated.');
      },
      err => {
        this.toastService.danger(`The test suite could not ne generated. ${err.data.message}`);
      }
    );
  }
}
