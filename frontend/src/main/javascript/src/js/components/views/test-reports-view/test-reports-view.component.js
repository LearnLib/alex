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

import remove from 'lodash/remove';
import {Selectable} from '../../../utils/selectable';

/**
 * The component for test reports.
 * @type {{template: *, controllerAs: string, controller: testReportsViewComponent.TestReportsViewComponent}}
 */
export const testReportsViewComponent = {
    template: require('./test-reports-view.component.html'),
    controllerAs: 'vm',
    controller: class TestReportsViewComponent {

        /**
         * Constructor.
         *
         * @param {TestReportResource} TestReportResource
         * @param {ProjectService} ProjectService
         * @param {ToastService} ToastService
         * @param {TestReportService} TestReportService
         * @param $state
         */
        // @ngInject
        constructor(TestReportResource, ProjectService, ToastService, TestReportService, $state) {
            this.testReportResource = TestReportResource;
            this.projectService = ProjectService;
            this.toastService = ToastService;
            this.testReportService = TestReportService;
            this.$state = $state;

            /**
             * The reports.
             * @type {Object[]}
             */
            this.reports = [];

            this.page = {};

            /**
             * The selected reports.
             * @type {Selectable}
             */
            this.selectedReports = new Selectable(this.reports, 'id');

            this.loadTestReports();
        }

        nextPage() {
            this.loadTestReports(Math.min(this.page.totalPages, this.page.number + 1));
        }

        previousPage() {
            this.loadTestReports(Math.max(0, this.page.number - 1));
        }

        loadTestReports(page = 0) {
            this.testReportResource.getAll(this.project.id, page)
                .then(page => {
                    this.page = page;
                    this.reports = this.page.content;
                    this.selectedReports = new Selectable(this.reports, 'id');
                })
                .catch((err) => this.toastService.danger(`Failed to load reports. ${err.data.message}`));
        }

        /**
         * Delete a report.
         * @param {Object} report The report.
         */
        deleteReport(report) {
            this.testReportResource.remove(this.project.id, report.id)
                .then(() => {
                    this.toastService.success(`The report has been deleted.`);
                    this._deleteReport(report);
                    this.loadTestReports(this.page.number);
                })
                .catch((err) => {
                    this.toastService.danger(`The report could not be deleted. ${err.data.message}`);
                });
        }

        /** Delete selected reports. */
        deleteSelectedReports() {
            const reportsToDelete = this.selectedReports.getSelected();
            this.testReportResource.removeMany(this.project.id, reportsToDelete)
                .then(() => {
                    this.toastService.success(`The reports have been deleted.`);
                    reportsToDelete.forEach(report => this._deleteReport(report));
                    this.loadTestReports(this.page.number);
                })
                .catch((err) => {
                    this.toastService.danger(`The reports could not be deleted. ${err.data.message}`);
                });
        }

        /**
         * Navigate to the report details view.
         * @param {Object} report The report.
         */
        openReport(report) {
            this.$state.go('testReport', {projectId: this.project.id, reportId: report.id});
        }

        /**
         * Download the report.
         * @param {Object} report The report.
         */
        downloadReport(report) {
            this.testReportService.download(this.project.id, report.id);
        }

        _deleteReport(report) {
            remove(this.reports, {id: report.id});
            this.selectedReports.unselect(report);
        }

        get project() {
            return this.projectService.store.currentProject;
        }
    }
};
