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

export const testsImportModal = {
    templateUrl: 'html/components/modals/tests-import-modal.html',
    bindings: {
        close: '&',
        dismiss: '&',
        resolve: '='
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         *
         * @param {SessionService} SessionService
         * @param {SymbolResource} SymbolResource
         * @param {TestResource} TestResource
         */
        // @ngInject
        constructor(SessionService, SymbolResource, TestResource) {
            this.SymbolResource = SymbolResource;
            this.TestResource = TestResource;

            this.project = SessionService.getProject();

            this.tests = [];
            this.errorMessage = null;
        }

        /**
         * Callback from the file drop zone.
         *
         * @param {string} data - The contents of the imported file.
         */
        fileLoaded(data) {
            try {
                const tests = JSON.parse(data);
                if (!tests.length) throw 'The file does not seem to contain any tests';
                this.tests = tests;
                this.errorMessage = null;
            } catch (exception) {
                this.errorMessage = '' + exception;
            }
        }

        /**
         * Import all test cases.
         */
        importTests() {
            this.errorMessage = null;

            if (this.tests.length) {
                this.SymbolResource.getAll(this.project.id)
                    .then(symbols => {
                        const tests = JSON.parse(JSON.stringify(this.tests));

                        const mapTestCaseSymbols = (testCase) => {
                            testCase.symbols = testCase.symbols.map(name => {
                                const sym = symbols.find(s => s.name === name);
                                if (sym) return sym.id;
                            });
                        };

                        const prepareTestCase = (testCase, parent) => {
                            testCase.project = this.project.id;
                            testCase.parent = parent;
                            mapTestCaseSymbols(testCase);
                        };

                        const prepareTestSuite = (testSuite, parent) => {
                            testSuite.project = this.project.id;
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
                                prepareTestCase(test, this.resolve.modalData.test.id);
                            } else {
                                prepareTestSuite(test, this.resolve.modalData.test.id);
                            }
                        }

                        this.TestResource.createMany(this.project.id, tests)
                            .then(tests => this.close({$value: tests}))
                            .catch(err => this.errorMessage = err.data.message);
                    })
                    .catch(err => this.errorMessage = err.data.message);

            } else {
                this.errorMessage = 'There aren\'t any tests to import';
            }
        }
    }
};
