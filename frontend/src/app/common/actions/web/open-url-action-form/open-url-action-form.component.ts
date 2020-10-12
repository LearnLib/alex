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

import { Project } from '../../../../entities/project';
import { GoToWebAction } from '../../../../entities/actions/web/open-url-action';
import { AppStoreService } from '../../../../services/app-store.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'open-url-action-form',
  templateUrl: './open-url-action-form.component.html'
})
export class OpenUrlActionFormComponent implements OnInit {

  @Input()
  action: GoToWebAction;

  selectedBaseUrl: string;

  constructor(private appStore: AppStoreService) {
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

  handleBaseUrlChange(): void {
    this.action.baseUrl = this.selectedBaseUrl;
  }
}
