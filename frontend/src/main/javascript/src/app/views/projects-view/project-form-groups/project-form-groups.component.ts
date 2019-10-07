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
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'project-form-groups',
  templateUrl: './project-form-groups.component.html'
})
export class ProjectFormGroupsComponent implements OnInit {

  @Input()
  public project: Project;

  @Input()
  public form: FormGroup;

  ngOnInit(): void {
    this.form.addControl('name', new FormControl(this.project.name, [
      Validators.required
    ]));
    this.form.addControl('description', new FormControl(this.project.description, [
      Validators.maxLength(250)
    ]));
  }

  isInvalidFormControl(c: AbstractControl): boolean {
    return c.invalid && (c.dirty || c.touched);
  }
}
