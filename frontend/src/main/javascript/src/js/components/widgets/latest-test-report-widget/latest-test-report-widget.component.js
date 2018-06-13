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
 * The widget that displays the latest test report.
 * @type {{template: *, bindings: {project: string}, controller: latestTestReportWidgetComponent.controller, controllerAs: string}}
 */
export const latestTestReportWidgetComponent = {
    template: require('./latest-test-report-widget.component.html'),
    bindings: {
        project: '='
    },
    controller: class {

        /**
         * Constructor.
         * @param {TestReportResource} TestReportResource
         */
        // @ngInject
        constructor(TestReportResource) {
            this.testReportResource = TestReportResource;
            this.report = null;
        }

        $onInit() {
            this.testReportResource.getLatest(this.project.id)
                .then(report => {
                    this.report = report;
                })
                .catch(console.log);
        }
    },
    controllerAs: 'vm'
};
