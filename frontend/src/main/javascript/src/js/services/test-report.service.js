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

import {DateUtils} from '../utils/date-utils';

/**
 * The service for test cases and test suites.
 */
export class TestReportService {

    /**
     * Constructor.
     *
     * @param {TestReportResource} TestReportResource
     * @param {PromptService} PromptService
     * @param {DownloadService} DownloadService
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(TestReportResource, PromptService, DownloadService, ToastService) {
        this.testReportResource = TestReportResource;
        this.promptService = PromptService;
        this.downloadService = DownloadService;
        this.toastService = ToastService;
    }

    /**
     * Download a test report.
     *
     * @param {number} projectId The id of the project.
     * @param {number} reportId The id of the report.
     */
    download(projectId, reportId) {
        this.testReportResource.get(projectId, reportId, {format: 'junit+xml'})
            .then((xml) => {
                this.promptService.prompt('Enter the name for the report', 'report-' + DateUtils.YYYYMMDD())
                    .then((name) => {
                        this.downloadService.downloadXml(xml, name);
                        this.toastService.success('The report has been downloaded.');
                    });
            }).catch(console.log);
    }
}
