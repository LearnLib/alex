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
 * The component for a single test report.
 * @type {{template: *, controllerAs: string, controller: testReportViewComponent.TestReportViewComponent}}
 */
export const testReportViewComponent = {
    template: require('./test-report-view.component.html'),
    controllerAs: 'vm',
    controller: class TestReportViewComponent {

        /**
         * Constructor.
         *
         * @param {TestReportResource} TestReportResource
         * @param {ProjectService} ProjectService
         * @param {ToastService} ToastService
         * @param {TestReportService} TestReportService
         * @param $state
         * @param $stateParams
         */
        // @ngInject
        constructor(TestReportResource, ProjectService, ToastService, TestReportService, $state, $stateParams) {
            this.testReportResource = TestReportResource;
            this.projectService = ProjectService;
            this.toastService = ToastService;
            this.testReportService = TestReportService;
            this.$state = $state;
            this.$stateParams = $stateParams;

            /**
             * The report.
             * @type {Object}
             */
            this.report = null;

            this.testReportResource.get(this.project.id, this.$stateParams.reportId)
                .then((data) => this.report = data)
                .catch((err) => this.toastService.danger(`Failed to load the report. ${err.data.message}`));
        }

        /** Deletes the report. */
        deleteReport() {
            this.testReportResource.remove(this.project.id, this.report.id)
                .then(() => {
                    this.toastService.success('The report has been deleted.');
                    this.$state.go('testReports', {projectId: this.project.id});
                })
                .catch((err) => this.toastService.danger(`The report could not be deleted. ${err.data.message}`));
        }

        /** Download the report. */
        downloadReport() {
            this.testReportService.download(this.project.id, this.report.id);
        }

        get project() {
            return this.projectService.store.currentProject;
        }
    }
};
