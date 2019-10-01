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

import { Injectable } from '@angular/core';
import { Project } from '../entities/project';

@Injectable()
export class AppStoreService {

  /**
   * The project that is currently open.
   * Is saved in the sessionstorage.
   */
  project: Project;

  /**
   * If the sidebar is collapsed.
   * The setting is persisted in the localstorage.
   */
  sidebarCollapsed: boolean;

  constructor() {
    this.sidebarCollapsed = false;

    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (sidebarCollapsed != null) {
      this.sidebarCollapsed = JSON.parse(sidebarCollapsed);
    }

    const project = sessionStorage.getItem('project');
    if (project != null) {
      this.project = new Project(JSON.parse(project));
    }
  }

  openProject(project: Project): void {
    sessionStorage.setItem('project', JSON.stringify(project));
    this.project = project;
  }

  closeProject(): void {
    sessionStorage.removeItem('project');
    this.project = null;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
  }
}
