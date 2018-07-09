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

export const testSuiteGenerationModalComponent = {
    template: require('./test-suite-generation-modal.component.html'),
    bindings: {
        resolve: '=',
        close: '&',
        dismiss: '&'
    },
    controllerAs: 'vm',
    controller: class TestSuiteGenerationModalComponent {

        /**
         * Constructor.
         *
         * @param {LearnResultResource} LearnResultResource
         * @param {ToastService} ToastService
         */
        // @ngInject
        constructor(LearnResultResource, ToastService) {
            this.learnResultResource = LearnResultResource;
            this.toastService = ToastService;

            /**
             * The current learner result.
             * @type {?LearnResult}
             */
            this.result = null;

            /**
             * The error message.
             * @type {?string}
             */
            this.errorMessage = null;

            /** The config to use for the generation. */
            this.config = {
                stepNo: 0,
                includeParameterValues: false,
                name: '',
            };
        }

        $onInit() {
            this.result = this.resolve.result;
            this.config.stepNo = this.resolve.stepNo;
            this.config.name = `TestNo ${this.result.testNo} (Generated)`;
        }

        generate() {
            this.errorMessage = null;

            if (this.config.name.trim() === '') {
                this.errorMessage = 'The name may not be empty.';
                return;
            }

            this.learnResultResource.generateTestSuite(this.result.project, this.result.testNo, this.config)
                .then(testSuite => {
                    this.toastService.success('The test suite has been generated.');
                    this.close({$value: testSuite});
                })
                .catch(err => {
                    this.errorMessage = `The test suite could not be generated. ${err.data.message}`;
                });
        }
    }
};
