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

  /** The item groups */
  groups: any[];

  constructor(public appStore: AppStoreService) {

    this.groups = [
      {
        title: () => 'Admin',
        display: () => this.user != null && this.user.role === 'ADMIN',
        items: [
          {
            title: 'Settings',
            icon: 'fa-cogs',
            display: () => true,
            href: () => ['admin', 'settings']
          },
          {
            title: 'User Management',
            icon: 'fa-users',
            display: () => true,
            href: () => ['admin', 'users']
          }
        ]
      },
      {
        title: () => this.project ? this.project.name : 'Projects',
        display: () => this.user,
        items: [
          {
            title: 'Overview',
            icon: 'fa-briefcase',
            display: () => this.project == null,
            href: () => ['projects']
          },
          {
            title: 'Dashboard',
            icon: 'fa-columns',
            display: () => this.project != null,
            href: () => ['projects', this.project.id]
          },
          {
            title: 'Environments',
            icon: 'fa-cloud',
            display: () => this.project != null,
            href: () => ['projects', this.project.id, 'environments']
          },
          {
            title: 'Files',
            icon: 'fa-file',
            display: () => this.project != null,
            href: () => ['projects', this.project.id, 'files']
          },
          {
            title: 'Close',
            icon: 'fa-sign-out-alt',
            display: () => this.project != null,
            href: () => ['projects']
          }
        ]
      },
      {
        title: () => 'Symbols',
        display: () => this.user != null && this.project != null,
        items: [
          {
            title: 'Manage',
            icon: 'fa-list-alt',
            display: () => true,
            href: () => ['projects', this.project.id, 'symbols']
          },
          {
            title: 'Archive',
            icon: 'fa-archive',
            display: () => true,
            href: () => ['projects', this.project.id, 'symbols', 'archive']
          }
        ]
      },
      {
        title: () => 'Testing',
        display: () => this.user != null && this.project != null,
        items: [
          {
            title: 'Manage',
            icon: 'fa-wrench',
            display: () => true,
            href: () => ['projects', this.project.id, 'tests']
          },
          {
            title: 'Reports',
            icon: 'fa-list',
            display: () => true,
            href: () => ['projects', this.project.id, 'tests', 'reports']
          }
        ]
      },
      {
        title: () => 'Learning',
        display: () => this.user != null && this.project != null,
        items: [
          {
            title: 'Setup',
            icon: 'fa-play',
            display: () => true,
            href: () => ['projects', this.project.id, 'learner', 'setup']
          },
          {
            title: 'Results',
            icon: 'fa-sitemap',
            display: () => true,
            href: () => ['projects', this.project.id, 'learner', 'results']
          },
          {
            title: 'Lts Formulas',
            icon: 'fa-subscript',
            display: () => true,
            href: () => ['projects', this.project.id, 'lts-formulas']
          },
          {
            title: 'Counters',
            icon: 'fa-list-ol',
            display: () => true,
            href: () => ['projects', this.project.id, 'counters']
          }
        ]
      },
      {
        title: () => 'Integrations',
        display: () => this.user != null,
        items: [
          {
            title: 'Webhooks',
            icon: 'fa-share-alt',
            display: () => this.user != null,
            href: () => ['integrations', 'webhooks']
          }
        ]
      }
    ];
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
