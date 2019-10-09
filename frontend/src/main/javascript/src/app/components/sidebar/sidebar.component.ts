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

/**
 * The controller for the sidebar.
 */
class SidebarComponent {

  /** The item groups */
  public groups: any[];

  /* @ngInject */
  constructor(private $state: any,
              private appStore: AppStoreService) {

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
            href: () => '#!/profile'
          },
          {
            title: 'Logout',
            icon: 'fa-sign-out-alt',
            active: () => false,
            display: () => true,
            href: () => '#!/logout'
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
            href: () => '#!/admin/settings'
          },
          {
            title: 'User Management',
            icon: 'fa-users',
            active: () => this.isState('adminUsers'),
            display: () => true,
            href: () => '#!/admin/users'
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
            href: () => '#!/projects'
          },
          {
            title: 'Dashboard',
            icon: 'fa-columns',
            active: () => this.isState('project'),
            display: () => this.project,
            href: () => `#!/projects/${this.project.id}`
          },
          {
            title: 'Environments',
            icon: 'fa-cloud',
            active: () => this.isState('environments'),
            display: () => this.project,
            href: () => `#!/projects/${this.project.id}/environments`
          },
          {
            title: 'Files',
            icon: 'fa-file',
            active: () => this.isState('files'),
            display: () => this.project,
            href: () => `#!/projects/${this.project.id}/files`
          },
          {
            title: 'Close',
            icon: 'fa-sign-out-alt',
            active: () => false,
            display: () => this.project,
            click: () => this.closeProject(),
            href: () => '/'
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
            href: () => `#!/projects/${this.project.id}/symbols`
          },
          {
            title: 'Archive',
            icon: 'fa-archive',
            active: () => this.isState('symbolsArchive'),
            display: () => true,
            href: () => `#!/projects/${this.project.id}/symbols/archive`
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
            href: () => `#!/projects/${this.project.id}/tests/0`
          },
          {
            title: 'Reports',
            icon: 'fa-list',
            active: () => this.isState('testReports', 'testReport'),
            display: () => true,
            href: () => `#!/projects/${this.project.id}/tests/reports`
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
            href: () => `#!/projects/${this.project.id}/learner/setup`
          },
          {
            title: 'Results',
            icon: 'fa-sitemap',
            active: () => this.isState('learnerResults', 'learnerResultsCompare', 'learnerResultsStatistics'),
            display: () => true,
            href: () => `#!/projects/${this.project.id}/learner/results`
          },
          {
            title: 'Lts Formulas',
            icon: 'fa-subscript',
            active: () => this.isState('ltsFormulas'),
            display: () => true,
            href: () => `#!/projects/${this.project.id}/lts-formulas`
          },
          {
            title: 'Counters',
            icon: 'fa-list-ol',
            active: () => this.isState('counters'),
            display: () => true,
            href: () => `#!/projects/${this.project.id}/counters`
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
            href: () => '#!/integrations/webhooks'
          }
        ]
      }
    ];
  }

  /** Removes the project object from the session and redirect to the start page. */
  closeProject(): void {
    this.appStore.closeProject();
    location.hash = `!/projects`;
  }

  /** Toggles the collapsed state. */
  toggleCollapse(): void {
    this.appStore.toggleSidebar();
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
    return this.appStore.project;
  }

  get user(): User {
    return this.appStore.user;
  }
}

export const sidebarComponent = {
  template: require('html-loader!./sidebar.component.html'),
  controller: SidebarComponent,
  controllerAs: 'vm'
};
