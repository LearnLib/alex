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

import { Component, Input, OnInit } from '@angular/core';
import { ProjectUrl } from '../../../entities/project-url';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form-utils.service';

@Component({
  selector: 'project-url-form-groups',
  templateUrl: './project-url-form-groups.component.html'
})
export class ProjectUrlFormGroupsComponent implements OnInit {

  @Input()
  public url: ProjectUrl;

  @Input()
  public form: FormGroup;

  constructor(public formUtils: FormUtilsService) {
  }

  ngOnInit(): void {
    this.form.addControl('name', new FormControl(this.url.name, [
      Validators.required
    ]));
    this.form.addControl('url', new FormControl(this.url.url, [
      Validators.required, Validators.pattern(/^https?:\/\//)
    ]));
  }
}
