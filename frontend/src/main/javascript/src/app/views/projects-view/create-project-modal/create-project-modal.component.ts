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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateProjectForm, Project } from '../../../entities/project';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectApiService } from '../../../services/api/project-api.service';
import { FormUtilsService } from '../../../services/form-utils.service';

@Component({
  selector: 'create-project-modal',
  templateUrl: './create-project-modal.component.html'
})
export class CreateProjectModalComponent {

  public form: FormGroup;

  public errorMessage: string;

  public project: Project;

  constructor(public modal: NgbActiveModal,
              public formUtils: FormUtilsService,
              private projectApi: ProjectApiService) {

    this.project = new Project();
    this.form = new FormGroup({
      'url': new FormControl('http://', [
        Validators.required, Validators.pattern('^https?://.*?')
      ])
    });
  }

  createProject(): void {
    this.errorMessage = null;

    const p: CreateProjectForm = {
      url: this.form.controls.url.value,
      name: this.form.controls.name.value,
      description: this.form.controls.description.value
    };

    this.projectApi.create(p).subscribe(
      createdProject => this.modal.close(createdProject),
      res => this.errorMessage = res.error.message
    );
  }
}
