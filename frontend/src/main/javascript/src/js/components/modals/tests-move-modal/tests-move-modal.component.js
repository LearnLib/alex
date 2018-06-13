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

export const testsMoveModalComponent = {
    template: require('./tests-move-modal.component.html'),
    bindings: {
        resolve: '=',
        close: '&',
        dismiss: '&'
    },
    controllerAs: 'vm',
    controller: class TestsMoveModalComponent {

        /**
         * Constructor.
         *
         * @param {TestResource} TestResource
         * @param {ToastService} ToastService
         * @param {SessionService} SessionService
         */
        // @ngInject
        constructor(TestResource, ToastService, SessionService) {
            this.testResource = TestResource;
            this.toastService = ToastService;
            this.sessionService = SessionService;

            /**
             * The current project.
             * @type {Project}
             */
            this.project = this.sessionService.getProject();

            /**
             * The root test suite.
             * @type {Object}
             */
            this.root = null;

            /**
             * The tests to move.
             * @type {Object[]}
             */
            this.tests = [];

            /**
             * The test suite to move the tests to.
             * @type {Object}
             */
            this.selectedTestSuite = null;

            /**
             * The error message to display.
             * @type {String}
             */
            this.errorMessage = null;
        }

        $onInit() {
            this.testResource.getRoot(this.project.id)
                .then(root => this.root = root);

            this.tests = this.resolve.tests;
        }

        /**
         * Select a target test suite.
         *
         * @param {Object} testSuite The target test suite.
         */
        selectTestSuite(testSuite) {
            if (this.selectedTestSuite == null) {
                this.selectedTestSuite = testSuite;
            } else if (this.selectedTestSuite.id === testSuite.id) {
                this.selectedTestSuite = this.root;
            } else {
                this.selectedTestSuite = testSuite;
            }
        }

        /**
         * Move the tests to the new test suite.
         */
        moveTests() {
            this.errorMessage = null;

            if (this.selectedTestSuite == null) {
                this.errorMessage = 'You have to select a test suite.';
                return;
            }

            const testIds = this.tests.map(t => t.id);
            const targetId = this.selectedTestSuite.id;
            this.testResource.moveMany(this.project.id, testIds, targetId)
                .then(movedTests => {
                    this.toastService.success('The tests have been moved.');
                    this.close({$value: movedTests});
                })
                .catch(err => {
                    this.errorMessage = `The tests could not be moved. ${err.data.message}`;
                });
        }
    }
};
