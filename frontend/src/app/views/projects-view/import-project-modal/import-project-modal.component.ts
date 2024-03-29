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

import { Component } from '@angular/core';
import { ProjectApiService } from '../../../services/api/project-api.service';
import { ToastService } from '../../../services/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';
import { FileLoadedData } from '../../../common/file-dropzone/file-dropzone.component';

@Component({
  selector: 'import-project-modal',
  templateUrl: './import-project-modal.component.html'
})
export class ImportProjectModalComponent {

  /** The error message. */
  errorMessage: string = null;

  /** The data to import */
  importData: any = null;

  loading = false;

  form = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  constructor(public modal: NgbActiveModal,
              public formUtils: FormUtilsService,
              private projectApi: ProjectApiService,
              private toastService: ToastService) {
  }

  /**
   * Load the symbols from a JSON file.
   *
   * @param data The serialized symbols.
   */
  fileLoaded(data: FileLoadedData): void {
    const importData = JSON.parse(data.data);
    if (importData.type == null || ['project'].indexOf(importData.type) === -1) {
      this.errorMessage = 'The file does not seem to contain a project.';
    } else {
      this.importData = importData;
      this.form.controls.name.setValue(importData.project.name);
    }
  }

  /**
   * Import the symbols and close the modal window on success.
   */
  importProject(): void {
    this.errorMessage = null;
    this.loading = true;

    this.importData.project.name = this.form.controls.name.value;
    this.projectApi.import(this.importData).subscribe({
      next: importedProject => {
        this.toastService.success('The project has been imported');
        this.modal.close(importedProject);
        this.loading = false;
      },
      error: res => {
        this.loading = false;
        this.errorMessage = `The project could not be imported. ${res.error.message}`;
      }
    });
  }
}
