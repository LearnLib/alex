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

/**
 * Displays a test result.
 * @type {{template, bindings: {report: string}, controllerAs: string, controller: testResultReportComponent.TestResultReportComponent}}
 */
export const testResultReportComponent = {
    template: require('./test-result-report.component.html'),
    bindings: {
        report: '='
    },
    controllerAs: 'vm',
    controller: class TestResultReportComponent {

        /**
         * Constructor.
         *
         * @param {ProjectService} ProjectService
         * @param {TestReportService} TestReportService
         */
        // @ngInject
        constructor(ProjectService, TestReportService) {
            this.ProjectService = ProjectService;
            this.TestReportService = TestReportService;

            /**
             * The report.
             * @type {object}
             */
            this.report = null;
        }

        /** Saves the report as JUnit XML. */
        exportReport() {
            this.TestReportService.download(this.project.id, this.report.id);
        }

        get project() {
            return this.ProjectService.store.currentProject;
        }
    }
};
