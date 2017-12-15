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

import {DateUtils} from "../utils/date-utils";

/**
 * Displays a test result.
 * @type {{templateUrl: string, bindings: {result: string}, controllerAs: string, controller: testResult.controller}}
 */
export const testResultReport = {
    templateUrl: 'html/components/test-result-report.html',
    bindings: {
        results: '=',
        suite: '='
    },
    controllerAs: 'vm',
    controller: class {

        /**
         * Constructor.
         *
         * @param {DownloadService} DownloadService
         * @param {PromptService} PromptService
         * @param {ToastService} ToastService
         * @param {TestResource} TestResource
         * @param {SessionService} SessionService
         */
        // @ngInject
        constructor(DownloadService, PromptService, ToastService, TestResource, SessionService) {
            this.DownloadService = DownloadService;
            this.PromptService = PromptService;
            this.ToastService = ToastService;
            this.TestResource = TestResource;
            this.SessionService = SessionService;

            /**
             * The results.
             * @type {object}
             */
            this.results = {};

            /**
             * The parent test suite.
             * @type {object}
             */
            this.suite = null;

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
            for (const id in this.results) {
                const result = this.results[id];

                if (result.test.type === 'suite') {
                    this.overallResult.testCasesFailed += result.testCasesFailed;
                    this.overallResult.testCasesPassed += result.testCasesPassed;
                    this.overallResult.testCasesRun += result.testCasesRun;
                } else {
                    this.overallResult.testCasesFailed += result.passed ? 0 : 1;
                    this.overallResult.testCasesPassed += result.passed ? 1 : 0;
                    this.overallResult.testCasesRun += 1;
                }
                this.overallResult.passed &= result.passed;
                this.overallResult.time += result.time;
            }
        }

        /**
         * Saves the report as JUnit XML.
         */
        exportReport() {
            const parent = JSON.parse(JSON.stringify(this.suite));
            parent.tests = [];

            this.TestResource.getReport(this.project.id, {
                results: this.results,
                parent: parent
            }).then(data => {
                this.PromptService.prompt('Enter the name for the report', 'report-' + DateUtils.YYYYMMDD())
                    .then(name => {
                        this.DownloadService.downloadXml(data, name);
                        this.ToastService.success('The report has been downloaded.');
                    });
            }).catch(console.log);
        }
    }
};