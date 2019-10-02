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

import { User } from '../../../entities/user';
import { Project } from '../../../entities/project';
import { AppStoreService } from '../../../services/app-store.service';

/**
 * The controller of the index page.
 */
export const rootViewComponent = {
  template: require('html-loader!./root-view.component.html'),
  controllerAs: 'vm',
  controller: class RootViewComponent {

    /* @ngInject */
    constructor(private $state: any,
                private appStore: AppStoreService) {

      if (this.user !== null) {
        if (this.project !== null) {
          $state.go('project', {projectId: this.project.id});
        } else {
          $state.go('projects');
        }
      }
    }

    handleLoggedIn(): void {
      this.$state.go('projects');
    }

    get user(): User {
      return this.appStore.user;
    }

    get project(): Project {
      return this.appStore.project;
    }
  }
};
