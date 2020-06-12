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

import { Injectable } from '@angular/core';
import { Project } from '../entities/project';
import { User } from '../entities/user';
import { ClipboardService } from './clipboard.service';
import { ProjectApiService } from './api/project-api.service';
import { Router } from '@angular/router';

@Injectable()
export class AppStoreService {

  /**
   * The project that is currently open.
   * Is saved in the sessionstorage.
   */
  project: Project;

  /**
   * The current user.
   * Is saved in the localstorage.
   */
  user: User;

  /**
   * If the sidebar is collapsed.
   * The setting is persisted in the localstorage.
   */
  sidebarCollapsed: boolean;

  constructor(private clipboard: ClipboardService,
              private projectApi: ProjectApiService,
              private router: Router) {
    this.sidebarCollapsed = false;

    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (sidebarCollapsed != null) {
      this.sidebarCollapsed = JSON.parse(sidebarCollapsed);
    }

    const project = sessionStorage.getItem('project');
    if (project != null) {
      this.project = new Project(JSON.parse(project));
    }

    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = User.fromData(JSON.parse(user));
    }
  }

  login(user: User, jwt: string = null): void {
    this.clipboard.clear();
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
    if (jwt) {
      localStorage.setItem('jwt', jwt);
    }
  }

  /** Removes all user related data from the session. */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
    this.user = null;
    this.closeProject();
    this.clipboard.clear();
    this.router.navigate(['/login']);
  }

  openProject(project: Project): void {
    sessionStorage.setItem('project', JSON.stringify(project));
    this.project = project;
  }

  closeProject(): void {
    sessionStorage.removeItem('project');
    this.project = null;
  }

  reloadProject(): void {
    if (this.project != null) {
      this.projectApi.get(this.project.id).subscribe(
        p => this.openProject(p)
      );
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed));
  }
}
