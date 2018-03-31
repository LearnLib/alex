/*
 * Copyright 2016 TU Dortmund
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

/**
 * The service for test cases and test suites.
 */
export class TestService {

    /**
     * Constructor.
     *
     * @param $uibModal
     * @param {SymbolResource} SymbolResource
     * @param {TestResource} TestResource
     */
    // @ngInject
    constructor($uibModal, SymbolResource, TestResource) {
        this.$uibModal = $uibModal;
        this.SymbolResource = SymbolResource;
        this.TestResource = TestResource;
    }

    /**
     * Prepare tests for export.
     *
     * @param {object} tests The tests to export.
     * @return {*}
     */
    exportTests(tests) {
        const prepareTestCase = (testCase) => {
            deleteProperties(testCase);

            testCase.steps = testCase.steps.map((step) => {
                if (step.type === 'symbol') {
                    step.symbol = step.symbol.name;
                    step.parameterValues.forEach(value => {
                        delete value.id;
                        delete value.parameter.id;
                    });
                }
                return step;
            });
        };

        const prepareTestSuite = (testSuite) => {
            deleteProperties(testSuite);
            testSuite.tests.forEach(test => {
                if (test.type === 'case') {
                    prepareTestCase(test);
                } else {
                    prepareTestSuite(test);
                }
            });
        };

        const deleteProperties = (test) => {
            delete test.id;
            delete test.project;
            delete test.user;
            delete test.parent;
            delete test._selected;
        };

        for (const test of tests) {
            if (test.type === 'case') {
                prepareTestCase(test);
            } else {
                prepareTestSuite(test);
            }
        }

        return tests;
    }

    /**
     * Import tests.
     *
     * @param {number} projectId The id of the project.
     * @param {object} testsToImport The tests to import.
     * @param {number} parentId The id of the parent test suite.
     */
    importTests(projectId, testsToImport, parentId) {
        return this.SymbolResource.getAll(projectId)
            .then((symbols) => {
                const tests = JSON.parse(JSON.stringify(testsToImport));

                const mapTestCaseSymbols = (testCase) => {
                    testCase.steps = testCase.steps.map((step) => {
                        if (step.type === 'symbol') {
                            const sym = symbols.find(s => s.name === step.symbol);
                            if (sym) {
                                step.symbol = sym.id;
                            }
                        }
                        return step;
                    });
                };

                const prepareTestCase = (testCase, parent) => {
                    testCase.project = projectId;
                    testCase.parent = parent;
                    mapTestCaseSymbols(testCase);
                };

                const prepareTestSuite = (testSuite, parent) => {
                    testSuite.project = projectId;
                    testSuite.parent = parent;
                    testSuite.tests.forEach(test => {
                        if (test.type === 'case') {
                            prepareTestCase(test, null);
                        } else {
                            prepareTestSuite(test, null);
                        }
                    });
                };

                for (let test of tests) {
                    if (test.type === 'case') {
                        prepareTestCase(test, parentId);
                    } else {
                        prepareTestSuite(test, parentId);
                    }
                }

                return this.TestResource.createMany(projectId, tests);
            });
    }

    /**
     * Opens the test import modal.
     *
     * @param {object} testSuite The test suite where the imported tests should be imported.
     */
    openImportModal(testSuite) {
        return this.$uibModal.open({
            component: 'testsImportModal',
            resolve: {
                modalData: () => ({test: testSuite})
            }
        }).result;
    }
}
