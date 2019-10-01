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

import { TestResource } from '../../../../services/resources/test-resource.service';
import { IFormController } from 'angular';
import { TestSuiteEqOracle } from '../../../../entities/eq-oracles/test-suite-eq-oracle';
import { AppStoreService } from '../../../../services/app-store.service';

export const testSuiteEqOracleFormComponent = {
  template: require('html-loader!./test-suite-eq-oracle-form.component.html'),
  bindings: {
    form: '=',
    eqOracle: '='
  },
  controllerAs: 'vm',
  controller: class TestSuiteEqOracleFormComponent {

    public form: IFormController;

    public eqOracle: TestSuiteEqOracle;

    /** The root test suite. */
    public root: any;

    /** The selected test suite. */
    public selectedTestSuite;

    /**
     * Constructor.
     *
     * @param projectService
     * @param testResource
     */
    /* @ngInject */
    constructor(private appStore: AppStoreService,
                private testResource: TestResource) {

      this.root = null;
      this.selectedTestSuite = null;
    }

    $onInit(): any {
      const project = this.appStore.project;

      this.testResource.getRoot(project.id)
        .then(root => this.root = root);

      if (this.eqOracle.testSuiteId != null) {
        this.testResource.get(project.id, this.eqOracle.testSuiteId)
          .then(ts => this.selectedTestSuite = ts);

      }
    }

    onSelected(testSuite: any): any {
      this.selectedTestSuite = testSuite;
      this.eqOracle.testSuiteId = testSuite.id;
    }
  }
};
