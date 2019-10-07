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

import { Component } from '@angular/core';
import { ProjectApiService } from '../../../services/resources/project-api.service';
import { ToastService } from '../../../services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'import-project-modal',
  templateUrl: './import-project-modal.component.html'
})
export class ImportProjectModalComponent {

  /** The error message. */
  public errorMessage: string = null;

  /** The data to import */
  public importData: any = null;

  public name: string;

  constructor(public modal: NgbActiveModal,
              private projectApi: ProjectApiService,
              private toastService: ToastService) {
  }

  /**
   * Load the symbols from a JSON file.
   *
   * @param data The serialized symbols.
   */
  fileLoaded(data: string): void {
    const importData = JSON.parse(data);
    if (importData.type == null || ['project'].indexOf(importData.type) === -1) {
      this.errorMessage = 'The file does not seem to contain a project.';
    } else {
      this.importData = importData;
      this.name = importData.project.name;
    }
  }

  /**
   * Import the symbols and close the modal window on success.
   */
  importProject(): void {
    this.errorMessage = null;

    this.importData.project.name = this.name;
    this.projectApi.import(this.importData).subscribe(
      importedProject => {
        this.toastService.success('The project has been imported');
        this.modal.close(importedProject);
      },
      res => {
        this.errorMessage = `The project could not be imported. ${res.error.message}`;
      }
    );
  }
}
