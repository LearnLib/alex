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

import { remove } from 'lodash';
import { Selectable } from '../../../utils/selectable';
import { TestReportApiService } from '../../../services/resources/test-report-api.service';
import { ToastService } from '../../../services/toast.service';
import { TestReportService } from '../../../services/test-report.service';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The component for test reports.
 */
export const testReportsViewComponent = {
  template: require('html-loader!./test-reports-view.component.html'),
  controllerAs: 'vm',
  controller: class TestReportsViewComponent {

    /** The reports. */
    public reports: any[];

    /** The selected reports. */
    public selectedReports: Selectable<any>;

    /** The page object */
    public page: any;

    /* @ngInject */
    constructor(private testReportApi: TestReportApiService,
                private appStore: AppStoreService,
                private toastService: ToastService,
                private testReportService: TestReportService) {

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
      this.testReportApi.getAll(this.project.id, page).subscribe(
        page => {
          this.page = page;
          this.reports = this.page.content;
          this.selectedReports = new Selectable(this.reports, 'id');
        },
        err => this.toastService.danger(`Failed to load reports. ${err.data.message}`)
      );
    }

    /**
     * Delete a report.
     *
     * @param report The report.
     */
    deleteReport(report: any): void {
      this.testReportApi.remove(this.project.id, report.id).subscribe(
        () => {
          this.toastService.success(`The report has been deleted.`);
          this._deleteReport(report);
          this.loadTestReports(this.page.number);
        },
        err => {
          this.toastService.danger(`The report could not be deleted. ${err.data.message}`);
        }
      );
    }

    /** Delete selected reports. */
    deleteSelectedReports(): void {
      const reportsToDelete = this.selectedReports.getSelected();
      this.testReportApi.removeMany(this.project.id, reportsToDelete).subscribe(
        () => {
          this.toastService.success(`The reports have been deleted.`);
          reportsToDelete.forEach(report => this._deleteReport(report));
          this.loadTestReports(this.page.number);
        },
        err => {
          this.toastService.danger(`The reports could not be deleted. ${err.data.message}`);
        }
      );
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
      return this.appStore.project;
    }
  }
};
