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

import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { Project } from '../../entities/project';
import { User } from '../../entities/user';

/**
 * The controller for the sidebar.
 */
class SidebarComponent {

  /** The item groups */
  public groups: any[];

  /**
   * Constructor.
   *
   * @param $state
   * @param projectService
   * @param userService
   * @param uiService
   */
  /* @ngInject */
  constructor(private $state: any,
              private projectService: ProjectService,
              private userService: UserService,
              private uiService: UiService) {

    this.groups = [
      {
        title: () => 'User',
        display: () => this.user,
        items: [
          {
            title: 'Profile',
            icon: 'fa-user',
            active: () => this.isState('profile'),
            display: () => true,
            sref: () => 'profile'
          },
          {
            title: 'Logout',
            icon: 'fa-sign-out-alt',
            active: () => false,
            display: () => true,
            sref: () => 'logout'
          }
        ]
      },
      {
        title: () => 'Admin',
        display: () => this.user && this.user.role === 'ADMIN',
        items: [
          {
            title: 'Settings',
            icon: 'fa-cogs',
            active: () => this.isState('adminSettings'),
            display: () => true,
            sref: () => 'adminSettings'
          },
          {
            title: 'User Management',
            icon: 'fa-users',
            active: () => this.isState('adminUsers'),
            display: () => true,
            sref: () => 'adminUsers'
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
            active: () => this.isState('projects'),
            display: () => !this.project,
            sref: () => 'projects'
          },
          {
            title: 'Dashboard',
            icon: 'fa-columns',
            active: () => this.isState('project'),
            display: () => this.project,
            sref: () => `project({projectId: ${this.project.id}})`
          },
          {
            title: 'Environments',
            icon: 'fa-cloud',
            active: () => this.isState('environments'),
            display: () => this.project,
            sref: () => `environments({projectId: ${this.project.id}})`
          },
          {
            title: 'Files',
            icon: 'fa-file',
            active: () => this.isState('files'),
            display: () => this.project,
            sref: () => `files({projectId: ${this.project.id}})`
          },
          {
            title: 'Close',
            icon: 'fa-sign-out-alt',
            active: () => false,
            display: () => this.project,
            click: () => this.closeProject(),
            sref: () => '/'
          }
        ]
      },
      {
        title: () => 'Symbols',
        display: () => this.user && this.project,
        items: [
          {
            title: 'Manage',
            icon: 'fa-list-alt',
            active: () => this.isState('symbols', 'symbol'),
            display: () => true,
            sref: () => `symbols({projectId: ${this.project.id}})`
          },
          {
            title: 'Archive',
            icon: 'fa-archive',
            active: () => this.isState('symbolsArchive'),
            display: () => true,
            sref: () => `symbolsArchive({projectId: ${this.project.id}})`
          }
        ]
      },
      {
        title: () => 'Testing',
        display: () => this.user && this.project,
        items: [
          {
            title: 'Manage',
            icon: 'fa-wrench',
            active: () => this.isState('test'),
            display: () => true,
            sref: () => `test({projectId: ${this.project.id}})`
          },
          {
            title: 'Reports',
            icon: 'fa-list',
            active: () => this.isState('testReports', 'testReport'),
            display: () => true,
            sref: () => `testReports({projectId: ${this.project.id}})`
          }
        ]
      },
      {
        title: () => 'Learning',
        display: () => this.user && this.project,
        items: [
          {
            title: 'Setup',
            icon: 'fa-play',
            active: () => this.isState('learnerSetup', 'learnerStart'),
            display: () => true,
            sref: () => `learnerSetup({projectId: ${this.project.id}})`
          },
          {
            title: 'Results',
            icon: 'fa-sitemap',
            active: () => this.isState('learnerResults', 'learnerResultsCompare', 'learnerResultsStatistics'),
            display: () => true,
            sref: () => `learnerResults({projectId: ${this.project.id}})`
          },
          {
            title: 'Lts Formulas',
            icon: 'fa-subscript',
            active: () => this.isState('ltsFormulas'),
            display: () => true,
            sref: () => `ltsFormulas({projectId: ${this.project.id}})`
          },
          {
            title: 'Counters',
            icon: 'fa-list-ol',
            active: () => this.isState('counters'),
            display: () => true,
            sref: () => `counters({projectId: ${this.project.id}})`
          },
        ]
      },
      {
        title: () => 'Integrations',
        display: () => this.user,
        items: [
          {
            title: 'Webhooks',
            icon: 'fa-share-alt',
            active: () => this.isState('webhooks'),
            display: () => this.user,
            sref: () => 'webhooks'
          }
        ]
      }
    ];
  }

  /** Removes the project object from the session and redirect to the start page. */
  closeProject(): void {
    this.projectService.close();
    this.$state.go('projects');
  }

  /** Toggles the collapsed state. */
  toggleCollapse(): void {
    this.uiService.toggleSidebar();
  }

  /**
   * Checks if at least one of the passed arguments is the current state name. Arguments should be strings.
   *
   * @param states The states the item belongs to.
   * @returns If the item should be highlighted.
   */
  isState(...states: string[]): boolean {
    let result = false;
    for (let i = 0; i < states.length; i++) {
      result = result || this.$state.current.name === arguments[i];
    }
    return result;
  }

  get project(): Project {
    return this.projectService.store.currentProject;
  }

  get user(): User {
    return this.userService.store.currentUser;
  }

  get collapsed(): boolean {
    return this.uiService.store.sidebar.collapsed;
  }
}

export const sidebarComponent = {
  template: require('html-loader!./sidebar.component.html'),
  controller: SidebarComponent,
  controllerAs: 'vm'
};
