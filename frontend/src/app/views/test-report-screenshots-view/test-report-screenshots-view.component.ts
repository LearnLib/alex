/*
 * Copyright 2015 - 2020 TU Dortmund
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

import { Component } from "@angular/core";
import { TestResultApiService } from "../../services/api/test-result-api.service";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ViewScreenshotModalComponent } from "./view-screenshot-modal/view-screenshot-modal.component";
import { DownloadService } from "../../services/download.service";
import { environment as env } from '../../../environments/environment';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'test-report-screenshots-view',
  templateUrl: './test-report-screenshots-view.component.html',
  styleUrls: ['./test-report-screenshots-view.component.scss']
})
export class TestReportScreenshotsViewComponent {

  testResult: any

  constructor(private testResultApi: TestResultApiService,
              private route: ActivatedRoute,
              private modalService: NgbModal,
              private toastService: ToastService,
              private downloadService: DownloadService) {
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(
      map => this.testResultApi.get(parseInt(map.get('projectId')), parseInt(map.get('reportId')), parseInt(map.get('resultId'))).subscribe(
        result => this.testResult = result)
    );
  }

  viewScreenshot(src: string, title: string) {
    const modalRef = this.modalService.open(ViewScreenshotModalComponent, {windowClass: 'modal-screenshot'});
    modalRef.componentInstance.src = src;
    modalRef.componentInstance.title = title;
  }

  downloadScreenshots() {
    this.testResultApi.getScreenshots(this.testResult.project, this.testResult.report, this.testResult.id)
      .subscribe(
        res => this.downloadService.downloadZipFromBlob(res.body, "screenshots"),
        () => this.toastService.danger('Failed to download ZIP archive')
      );
  }

  getBeforeScreenshotImageUrl() {
    return this.getScreenshotImageUrl(this.testResult.beforeScreenshot.filename);
  }

  getScreenshotImageUrl(filename: string) {
    return `/projects/${this.testResult.project}/tests/reports/${this.testResult.report}/results/${this.testResult.id}/screenshots/${filename}`;
  }
}
