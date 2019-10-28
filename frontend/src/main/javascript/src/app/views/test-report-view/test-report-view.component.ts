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

import { TestReportApiService } from '../../services/api/test-report-api.service';
import { ToastService } from '../../services/toast.service';
import { TestReportService } from '../../services/test-report.service';
import { Project } from '../../entities/project';
import { AppStoreService } from '../../services/app-store.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * The component for a single test report.
 */
@Component({
  selector: 'test-report-view',
  templateUrl: './test-report-view.component.html'
})
export class TestReportViewComponent implements OnInit {

  /** The report. */
  @Input()
  report: any;

  constructor(private testReportApi: TestReportApiService,
              private appStore: AppStoreService,
              private toastService: ToastService,
              private testReportService: TestReportService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      map => {
        this.testReportApi.get(this.project.id, parseInt(map.get('reportId'))).subscribe(
          data => this.report = data,
          res => this.toastService.danger(`Failed to load the report. ${res.error.message}`)
        );
      });
  }

  /** Deletes the report. */
  deleteReport(): void {
    this.testReportApi.remove(this.project.id, this.report.id).subscribe(
      () => {
        this.toastService.success('The report has been deleted.');
        this.router.navigate(['/app', 'projects', this.appStore.project.id, 'tests', 'reports']);
      },
      res => this.toastService.danger(`The report could not be deleted. ${res.error.message}`)
    );
  }

  /** Download the report. */
  downloadReport(): void {
    this.testReportService.download(this.project.id, this.report.id);
  }
}
