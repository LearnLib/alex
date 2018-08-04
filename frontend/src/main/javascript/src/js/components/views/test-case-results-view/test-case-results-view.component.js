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

export const testCaseResultsViewComponent = {
    template: require('./test-case-results-view.component.html'),
    controllerAs: 'vm',
    controller: class TestCaseResultsViewComponent {

        /**
         * Constructor.
         *
         * @param {ProjectService} ProjectService
         * @param {TestResource} TestResource
         * @param {Object} $stateParams
         */
        // @ngInject
        constructor(ProjectService, TestResource, $stateParams) {
            this.projectService = ProjectService;
            this.testResource = TestResource;

            /**
             * The test.
             * @type {?Object}
             */
            this.test = null;

            /**
             * The results of the test.
             * @type {Object[]}
             */
            this.results = [];

            this.testResource.get(this.project.id, $stateParams.testId)
                .then(test => {
                    this.test = test;
                    return this.testResource.getResults(this.project.id, this.test.id)
                        .then(results => this.results = results);
                })
                .catch(console.error);
        }

        get project() {
            return this.projectService.store.currentProject;
        }
    }
};
