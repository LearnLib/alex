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

import { TestApiService } from '../../../services/resources/test-api.service';
import { IFormController } from 'angular';
import { TestSuiteEqOracle } from '../../../entities/eq-oracles/test-suite-eq-oracle';
import { AppStoreService } from '../../../services/app-store.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'test-suite-eq-oracle-form',
  templateUrl: './test-suite-eq-oracle-form.component.html'
})
export class TestSuiteEqOracleFormComponent implements OnInit {

  @Input()
  form: IFormController;

  @Input('oracle')
  eqOracle: TestSuiteEqOracle;

  /** The root test suite. */
  root: any;

  /** The selected test suite. */
  selectedTestSuite;

  constructor(private appStore: AppStoreService,
              private testApi: TestApiService) {
    this.root = null;
    this.selectedTestSuite = null;
  }

  ngOnInit(): void {
    const project = this.appStore.project;

    this.testApi.getRoot(project.id).subscribe(
      root => this.root = root
    );

    if (this.eqOracle.testSuiteId != null) {
      this.testApi.get(project.id, this.eqOracle.testSuiteId).subscribe(
        ts => this.selectedTestSuite = ts
      );
    }
  }

  onSelected(testSuite: any): any {
    this.selectedTestSuite = testSuite;
    this.eqOracle.testSuiteId = testSuite.id;
  }
}
