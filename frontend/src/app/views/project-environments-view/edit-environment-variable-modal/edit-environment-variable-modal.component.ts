/*
 * Copyright 2015 - 2021 TU Dortmund
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
import { ProjectEnvironment } from '../../../entities/project-environment';
import { ProjectEnvironmentVariable } from '../../../entities/project-environment-variable';
import { ProjectEnvironmentApiService } from '../../../services/api/project-environment-api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';

@Component({
  selector: 'edit-environment-variable-modal',
  templateUrl: './edit-environment-variable-modal.component.html'
})
export class EditEnvironmentVariableModalComponent implements OnInit {

  @Input()
  public environment: ProjectEnvironment;

  @Input()
  public variable: ProjectEnvironmentVariable;

  public errorMessage: string;

  public form: FormGroup;

  constructor(public modal: NgbActiveModal,
              public formUtils: FormUtilsService,
              private projectEnvironmentApi: ProjectEnvironmentApiService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.variable.name, [Validators.required]),
      value: new FormControl(this.variable.value, [Validators.required])
    });
  }

  editVariable(): void {
    this.errorMessage = null;

    this.variable.name = this.form.controls.name.value;
    this.variable.value = this.form.controls.value.value;

    this.projectEnvironmentApi.updateVariable(this.environment.project, this.environment.id, this.variable.id, this.variable).subscribe(
      updatedVariable => {
        this.modal.close(updatedVariable);
      },
      res => {
        this.errorMessage = `The variable could not be updated. ${res.error.message}`;
      }
    );
  }
}
