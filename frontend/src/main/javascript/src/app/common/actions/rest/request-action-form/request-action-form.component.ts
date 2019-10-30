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

import { CallRestAction } from '../../../../entities/actions/rest/request-action';
import { Project } from '../../../../entities/project';
import { AppStoreService } from '../../../../services/app-store.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../../services/form-utils.service';

const presets = {
  JSON: 'JSON',
  GRAPH_QL: 'GRAPH_QL'
};

@Component({
  selector: 'request-action-form',
  templateUrl: './request-action-form.component.html'
})
export class RequestActionFormComponent implements OnInit {

  @Input()
  action: CallRestAction;
  selectedBaseUrl: string;

  cookieForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    value: new FormControl('')
  });

  headerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    value: new FormControl('')
  });

  /** Constructor. */
  constructor(private appStore: AppStoreService,
              public formUtils: FormUtilsService) {
  }

  get project(): Project {
    return this.appStore.project;
  }

  ngOnInit(): void {
    if (this.action.baseUrl == null) {
      this.action.baseUrl = this.project.getDefaultEnvironment().getDefaultUrl().name;
    }
    this.selectedBaseUrl = this.action.baseUrl;
  }

  addHeader(): void {
    const header = this.headerForm.value;
    this.action.addHeader(header.name, header.value);
    this.headerForm.reset();
  }

  addCookie(): void {
    const cookie = this.cookieForm.value;
    this.action.addCookie(cookie.name, cookie.value);
    this.cookieForm.reset();
  }

  handleBaseUrlChange(): void {
    this.action.baseUrl = this.selectedBaseUrl;
  }
}
