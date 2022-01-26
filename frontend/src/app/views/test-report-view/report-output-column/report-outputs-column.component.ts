/*
 * Copyright 2015 - 2022 TU Dortmund
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

import { Project } from '../../../entities/project';
import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExecutionResultModalComponent } from '../../../common/modals/execution-result-modal/execution-result-modal.component';

@Component({
  selector: 'report-outputs-column',
  templateUrl: './report-outputs-column.component.html'
})
export class ReportOutputsColumnComponent {

  @Input()
  public project: Project;

  @Input()
  public testResult: any;

  /** If the table is collapsed and only the outputs are displayed. */
  public collapse: boolean;

  constructor(private modalService: NgbModal) {
    this.collapse = true;
  }

  toggleCollapse(): void {
    this.collapse = !this.collapse;
  }

  showResultDetails(result: any): void {
    const modalRef = this.modalService.open(ExecutionResultModalComponent);
    modalRef.componentInstance.result = result;
  }
}
