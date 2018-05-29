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

export const testsImportModalComponent = {
    template: require('./tests-import-modal.component.html'),
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
         * @param {TestService} TestService
         */
        // @ngInject
        constructor(SessionService, SymbolResource, TestResource, TestService) {
            this.SymbolResource = SymbolResource;
            this.TestResource = TestResource;
            this.TestService = TestService;

            this.project = SessionService.getProject();

            this.errorMessage = null;
            this.importData = null;
        }

        /**
         * Callback from the file drop zone.
         *
         * @param {string} data - The contents of the imported file.
         */
        fileLoaded(data) {
            this.errorMessage = null;
            try {
                const importData = JSON.parse(data);
                if (importData.type !== 'tests' || importData.tests == null || importData.tests.length === 0) {
                    throw 'The file does not seem to contain any tests';
                }
                this.importData = importData;
            } catch (exception) {
                this.errorMessage = '' + exception;
            }
        }

        /**
         * Import all test cases.
         */
        importTests() {
            this.errorMessage = null;

            if (this.importData.tests.length) {
                const parentId = this.resolve.modalData.test.id;

                this.TestService.importTests(this.project.id, this.importData.tests, parentId)
                    .then(tests => this.close({$value: tests}))
                    .catch(err => this.errorMessage = err.data.message);
            } else {
                this.errorMessage = 'There aren\'t any tests to import';
            }
        }
    }
};
