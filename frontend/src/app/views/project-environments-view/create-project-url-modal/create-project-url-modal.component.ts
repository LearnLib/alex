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

import { Component, Input } from '@angular/core';
import { ProjectEnvironment } from '../../../entities/project-environment';
import { ProjectUrl } from '../../../entities/project-url';
import { ProjectEnvironmentApiService } from '../../../services/api/project-environment-api.service';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'create-project-url-modal',
  templateUrl: './create-project-url-modal.component.html'
})
export class CreateProjectUrlModalComponent {

  @Input()
  environment: ProjectEnvironment;

  form: FormGroup;
  url: ProjectUrl;
  errorMessage: string;

  constructor(public modal: NgbActiveModal,
              private projectEnvironmentApi: ProjectEnvironmentApiService) {
    this.url = new ProjectUrl();
    this.form = new FormGroup({});
  }

  /**
   * Updates the project. Closes the modal window on success.
   */
  createUrl(): void {
    this.errorMessage = null;

    this.url.name = this.form.controls.name.value;
    this.url.url = this.form.controls.url.value;

    this.projectEnvironmentApi.createUrl(this.environment.project, this.environment.id, this.url).subscribe(
      urls => this.modal.close(urls),
      res => {
        this.errorMessage = `The URL could not be created. ${res.error.message}`;
      }
    );
  }
}
