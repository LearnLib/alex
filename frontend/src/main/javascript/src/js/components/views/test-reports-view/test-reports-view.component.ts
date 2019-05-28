/*
 * Copyright 2015 - 2019 TU Dortmund
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

import * as remove from 'lodash/remove';
import {Selectable} from '../../../utils/selectable';
import {TestReportResource} from '../../../services/resources/test-report-resource.service';
import {ProjectService} from '../../../services/project.service';
import {ToastService} from '../../../services/toast.service';
import {TestReportService} from '../../../services/test-report.service';
import {Project} from '../../../entities/project';

/**
 * The component for test reports.
 * @type {{template: *, controllerAs: string, controller: testReportsViewComponent.TestReportsViewComponent}}
 */
export const testReportsViewComponent = {
  template: require('./test-reports-view.component.html'),
  controllerAs: 'vm',
  controller: class TestReportsViewComponent {

    /** The reports. */
    public reports: any[];

    /** The selected reports. */
    public selectedReports: Selectable<any>;

    /** The page object */
    public page: any;

    /**
     * Constructor.
     *
     * @param testReportResource
     * @param projectService
     * @param toastService
     * @param testReportService
     * @param $state
     */
    /* @ngInject */
    constructor(private testReportResource: TestReportResource,
                private projectService: ProjectService,
                private toastService: ToastService,
                private testReportService: TestReportService,
                private $state: any) {

      this.reports = [];
      this.page = {};
      this.selectedReports = new Selectable(this.reports, 'id');

      this.loadTestReports();
    }

    nextPage(): void {
      this.loadTestReports(Math.min(this.page.totalPages, this.page.number + 1));
    }

    previousPage(): void {
      this.loadTestReports(Math.max(0, this.page.number - 1));
    }

    loadTestReports(page: number = 0): void {
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
     *
     * @param report The report.
     */
    deleteReport(report: any): void {
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
    deleteSelectedReports(): void {
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
     *
     * @param report The report.
     */
    openReport(report: any): void {
      this.$state.go('testReport', {projectId: this.project.id, reportId: report.id});
    }

    /**
     * Download the report.
     *
     * @param report The report.
     */
    downloadReport(report: any): void {
      this.testReportService.download(this.project.id, report.id);
    }

    _deleteReport(report: any): void {
      remove(this.reports, {id: report.id});
      this.selectedReports.unselect(report);
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
