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

import { DateUtils } from '../utils/date-utils';
import { DownloadService } from './download.service';
import { PromptService } from './prompt.service';
import { TestReportApiService } from './api/test-report-api.service';
import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TestReportService {

  constructor(private testReportApi: TestReportApiService,
              private promptService: PromptService,
              private downloadService: DownloadService,
              private toastService: ToastService) {
  }

  /**
   * Download a test report.
   *
   * @param projectId The id of the project.
   * @param reportId The id of the report.
   */
  download(projectId: number, reportId: number): void {
    this.promptService.prompt('Enter the name for the report', 'report-' + DateUtils.YYYYMMDD())
      .then((name: string) => {
        this.testReportApi.export(projectId, reportId).subscribe(
          xml => {
            this.downloadService.downloadXml(xml, name);
            this.toastService.success('The report has been downloaded.');
          },
          console.error
        );
      });
  }
}
