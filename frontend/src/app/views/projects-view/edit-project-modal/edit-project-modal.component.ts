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

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../../entities/project';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectApiService } from '../../../services/api/project-api.service';

@Component({
  selector: 'edit-project-modal',
  templateUrl: './edit-project-modal.component.html'
})
export class EditProjectModalComponent implements OnInit {

  @Input()
  public project: Project;

  public form: FormGroup;

  public errorMessage: string;

  constructor(public modal: NgbActiveModal,
              private projectApi: ProjectApiService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      url: new FormControl('http://', [
        Validators.required, Validators.pattern('^https?://.*?')
      ])
    });
  }

  updateProject(): void {
    this.errorMessage = null;

    this.project.name = this.form.controls.name.value;
    this.project.description = this.form.controls.description.value;

    this.projectApi.update(this.project).subscribe(
      updatedProject => this.modal.close(updatedProject),
      res => this.errorMessage = res.error.message
    );
  }
}
