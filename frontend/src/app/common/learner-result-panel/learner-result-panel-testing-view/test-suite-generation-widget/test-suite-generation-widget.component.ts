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

import { LearnerResult } from '../../../../entities/learner-result';
import { LearnerResultApiService } from '../../../../services/api/learner-result-api.service';
import { ToastService } from '../../../../services/toast.service';
import { TestApiService } from '../../../../services/api/test-api.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../../services/form-utils.service';

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

  rootTestSuite: any;
  selectedTestSuite: any;

  form = new FormGroup({
    stepNo: new FormControl(1, [Validators.required, Validators.min(1)]),
    name: new FormControl('', [Validators.required]),
    method: new FormControl('DT')
  });

  constructor(private learnerResultApi: LearnerResultApiService,
              private toastService: ToastService,
              private testApi: TestApiService,
              public formUtils: FormUtilsService) {
  }

  ngOnInit(): void {
    this.form.controls.stepNo.setValue(this.stepNo + 1);
    this.form.controls.name.setValue(`TestNo ${this.result.testNo} (Generated)`);
    this.loadRootTestSuite();
  }

  loadRootTestSuite(): void {
    this.testApi.getRoot(this.result.project).subscribe(
      root => this.rootTestSuite = root
    );
  }

  handleTestSuiteSelected(testSuite): void {
    if (this.selectedTestSuite == null) {
      this.selectedTestSuite = testSuite;
    } else if (this.selectedTestSuite.id === testSuite.id) {
      this.selectedTestSuite = null;
    } else {
      this.selectedTestSuite = testSuite;
    }
  }

  generateTestSuite(): void {
    const config = this.form.value;
    config.testSuiteToUpdateId = this.selectedTestSuite != null ? this.selectedTestSuite.id : null;

    this.learnerResultApi.generateTestSuite(this.result.project, this.result.testNo, config).subscribe(
      () => {
        this.loadRootTestSuite();
        this.toastService.success('The test suite has been generated.');
      },
      res => {
        this.toastService.danger(`The test suite could not ne generated. ${res.error.message}`);
      }
    );
  }
}
