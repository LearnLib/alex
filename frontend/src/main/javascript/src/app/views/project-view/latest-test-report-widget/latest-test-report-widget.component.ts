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

import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../../entities/project';
import { TestReportApiService } from '../../../services/resources/test-report-api.service';

@Component({
  selector: 'latest-test-report-widget',
  templateUrl: './latest-test-report-widget.component.html'
})
export class LatestTestReportWidgetComponent implements OnInit {

  @Input()
  public project: Project;

  /** The test report. */
  public report: any;

  constructor(private testReportApi: TestReportApiService) {
  }

  ngOnInit(): void {
    this.testReportApi.getLatest(this.project.id).subscribe(
      report => this.report = report,
      console.error
    );
  }
}
