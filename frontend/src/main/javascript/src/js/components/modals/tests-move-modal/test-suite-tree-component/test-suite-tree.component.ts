/*
 * Copyright 2018 TU Dortmund
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

export const testSuiteTreeComponent = {
  template: require('./test-suite-tree.component.html'),
  bindings: {
    testSuite: '=',
    selectedTestSuite: '=',
    level: '@',
    onSelected: '&',
  },
  controllerAs: 'vm',
  controller: class TestSuiteTreeComponent {

    public onSelected: (any) => void;

    public testSuite: any = null;

    public level: any;

    /** If the children are collapsed. */
    public collapse: boolean = false;

    $onInit(): void {
      this.level = this.level == null ? 0 : parseInt(this.level);
      if (this.level > 0) {
        this.collapse = true;
      }
    }

    /**
     * Get the test suites in the test.
     *
     * @return The test suites.
     */
    getTestSuites(): void {
      return this.testSuite.tests.filter(t => t.type === 'suite');
    }

    /**
     * Select the test suite where the tests should be moved to.
     *
     * @param testSuite The target test suite.
     */
    selectTestSuite(testSuite: any): void {
      this.onSelected({testSuite});
    }
  }
};
