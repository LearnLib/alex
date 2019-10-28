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

import { Project } from '../../entities/project';
import { User } from '../../entities/user';
import { AppStoreService } from '../../services/app-store.service';
import { Component } from '@angular/core';

/**
 * The controller for the sidebar.
 */
@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(public appStore: AppStoreService) {
  }

  get project(): Project {
    return this.appStore.project;
  }

  get user(): User {
    return this.appStore.user;
  }

  /** Toggles the collapsed state. */
  toggleCollapse(): void {
    this.appStore.toggleSidebar();
  }
}
