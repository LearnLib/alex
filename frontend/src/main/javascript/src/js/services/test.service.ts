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

import {SymbolResource} from './resources/symbol-resource.service';
import {TestResource} from './resources/test-resource.service';
import {IPromise} from 'angular';

/**
 * The service for test cases and test suites.
 */
export class TestService {

  /**
   * Constructor.
   *
   * @param $uibModal
   * @param symbolResource
   * @param testResource
   */
  // @ngInject
  constructor(private $uibModal: any,
              private symbolResource: SymbolResource,
              private testResource: TestResource) {
  }

  /**
   * Prepare tests for export.
   *
   * @param tests The tests to export.
   * @return The tests that can be exported.
   */
  exportTests(tests: any[]): any[] {
    for (const test of tests) {
      if (test.type === 'case') {
        prepareTestCase(test);
      } else {
        prepareTestSuite(test);
      }
    }

    return tests;

    function prepareTestCase(testCase) {
      deleteProperties(testCase);

      const s = (steps) => {
        return steps.map((step) => {
          delete step.id;
          delete step.pSymbol.id;
          step.pSymbol.symbol = {
            name: step.pSymbol.symbol.name
          };
          step.pSymbol.parameterValues.forEach(value => {
            delete value.id;
            delete value.parameter.id;
          });
          return step;
        });
      };

      testCase.steps = s(testCase.steps);
      testCase.preSteps = s(testCase.preSteps);
      testCase.postSteps = s(testCase.postSteps);
    }

    function prepareTestSuite(testSuite) {
      deleteProperties(testSuite);
      testSuite.tests.forEach(test => {
        if (test.type === 'case') {
          prepareTestCase(test);
        } else {
          prepareTestSuite(test);
        }
      });
    }

    function deleteProperties(test) {
      delete test.id;
      delete test.project;
      delete test.user;
      delete test.parent;
    }
  }

  /**
   * Import tests.
   *
   * @param projectId The id of the project.
   * @param testsToImport The tests to import.
   * @param parentId The id of the parent test suite.
   */
  importTests(projectId: number, testsToImport: any, parentId: number): IPromise<any> {
    return this.symbolResource.getAll(projectId)
      .then((symbols) => {
        const tests = JSON.parse(JSON.stringify(testsToImport));

        for (let test of tests) {
          if (test.type === 'case') {
            prepareTestCase(test, parentId);
          } else {
            prepareTestSuite(test, parentId);
          }
        }

        return this.testResource.createMany(projectId, tests);

        function prepareTestCase(testCase, parent) {
          testCase.project = projectId;
          testCase.parent = parent;
          mapTestCaseSymbols(testCase);
        }

        function prepareTestSuite(testSuite, parent) {
          testSuite.project = projectId;
          testSuite.parent = parent;
          testSuite.tests.forEach(test => {
            if (test.type === 'case') {
              prepareTestCase(test, null);
            } else {
              prepareTestSuite(test, null);
            }
          });
        }

        function mapTestCaseSymbols(testCase) {
          const s = (steps) => {
            return steps.map((step) => {
              const sym = symbols.find(s => s.name === step.pSymbol.symbol.name);
              if (sym) {
                step.pSymbol.symbol = {
                  id: sym.id
                };
              }
              return step;
            });
          };

          testCase.steps = s(testCase.steps);
          testCase.preSteps = s(testCase.preSteps);
          testCase.postSteps = s(testCase.postSteps);
        }
      });
  }

  /**
   * Opens the test import modal.
   *
   * @param testSuite The test suite where the imported tests should be imported.
   */
  openImportModal(testSuite: any): IPromise<any> {
    return this.$uibModal.open({
      component: 'testsImportModal',
      resolve: {
        parent: () => testSuite
      }
    }).result;
  }
}
