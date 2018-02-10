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
 * Displays a test result.
 * @type {{templateUrl: string, bindings: {result: string}, controllerAs: string, controller: testResult.controller}}
 */
export const testResultReportComponent = {
    template: require('./test-result-report.component.html'),
    bindings: {
        report: '='
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         *
         * @param {DownloadService} DownloadService
         * @param {PromptService} PromptService
         * @param {ToastService} ToastService
         * @param {TestReportResource} TestReportResource
         * @param {SessionService} SessionService
         * @param {TestReportService} TestReportService
         */
        // @ngInject
        constructor(DownloadService, PromptService, ToastService, TestReportResource, SessionService,
                    TestReportService) {
            this.DownloadService = DownloadService;
            this.PromptService = PromptService;
            this.ToastService = ToastService;
            this.TestReportResource = TestReportResource;
            this.SessionService = SessionService;
            this.TestReportService = TestReportService;

            /**
             * The report.
             * @type {object}
             */
            this.report = {};

            /**
             * The project.
             * @type {Project}
             */
            this.project = this.SessionService.getProject();

            /**
             * The cumulated result.
             * @type {{testCasesPassed: number, testCasesFailed: number, testCasesRun: number, passed: boolean}}
             */
            this.overallResult = {
                testCasesPassed: 0,
                testCasesFailed: 0,
                testCasesRun: 0,
                passed: true,
                time: 0
            };
        }

        $onInit() {
            for (const result of this.report.testResults) {
                if (result.test.type === 'case') {
                    this.overallResult.testCasesFailed += result.passed ? 0 : 1;
                    this.overallResult.testCasesPassed += result.passed ? 1 : 0;
                    this.overallResult.testCasesRun += 1;
                }
                this.overallResult.passed &= result.passed;
                this.overallResult.time += result.time;
            }
        }

        /** Saves the report as JUnit XML. */
        exportReport() {
            this.TestReportService.download(this.project.id, this.report.id);
        }
    }
};
