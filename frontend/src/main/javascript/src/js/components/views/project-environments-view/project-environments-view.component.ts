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

import { Project } from '../../../entities/project';
import { ProjectService } from '../../../services/project.service';
import { ProjectEnvironment } from '../../../entities/project-environment';
import { ProjectEnvironmentResourceService } from '../../../services/resources/project-environment-resource.service';
import { PromptService } from '../../../services/prompt.service';
import { ToastService } from '../../../services/toast.service';
import { remove } from 'lodash';
import { ProjectUrl } from '../../../entities/project-url';

/**
 * The controller for the page that lists all counters of a project in a list. It is also possible to delete them.
 */
export const projectEnvironmentsViewComponent = {
  template: require('./project-environments-view.component.html'),
  controllerAs: 'vm',
  controller: class ProjectEnvironmentsViewComponent {

    environments: ProjectEnvironment[];

    url: ProjectUrl;

    /* @ngInject */
    constructor(private projectService: ProjectService,
                private projectEnvironmentResource: ProjectEnvironmentResourceService,
                private promptService: PromptService,
                private toastService: ToastService,
                private $uibModal: any) {

      this.environments = [];
      this.url = new ProjectUrl();

      this.init();
    }

    init(): void {
      // load all existing counters from the server
      this.projectEnvironmentResource.getAll(this.project.id)
        .then(envs => {
          this.environments = envs;
          this.projectService.reloadCurrentProject();
        })
        .catch(console.error);
    }

    createEnvironment(): void {
      this.promptService.prompt('Enter a name for the environment').then(
        name => {
          const env = new ProjectEnvironment();
          env.name = name;
          this.projectEnvironmentResource.create(this.project.id, env).then(
            () => this.init()
          );
        }
      );
    }

    editEnvironment(env: ProjectEnvironment): void {
      this.promptService.prompt('Change the name of the environment', env.name).then(
        name => {
          const copy = env.copy();
          copy.name = name;
          this.projectEnvironmentResource.update(this.project.id, copy).then(updatedEnv => {
            this.toastService.success(`The environment has been updated.`);
            this.init();
          }).catch(err => this.toastService.danger(`Could not update environment. ${err.data.message}`));
        }
      );
    }

    deleteEnvironment(env: ProjectEnvironment): void {
      if (this.environments.length === 1) {
        this.toastService.danger('You cannot delete the only environment in a project.');
      } else {
        this.projectEnvironmentResource.delete(this.project.id, env).then(
          () => {
            this.toastService.success(`Environment ${env.name} has been deleted.`);
            this.init();
          }
        ).catch(err => this.toastService.danger(`Could not update environment. ${err.data.message}`));
      }
    }

    makeEnvironmentDefault(env: ProjectEnvironment): void {
      if (env.default) return;

      const e = env.copy();
      e.default = true;
      this.projectEnvironmentResource.update(env.project, e)
        .then(() => this.init())
        .catch(err => this.toastService.danger(`Failed to make environment default. ${err.data.message}`));
    }

    makeUrlDefault(env: ProjectEnvironment, url: ProjectUrl): void {
      if (url.default) return;

      const u = url.copy();
      u.default = true;
      this.projectEnvironmentResource.updateUrl(env.project, env.id, url.id, u)
        .then(() => this.init())
        .catch(err => this.toastService.danger(`Failed to make URL default. ${err.data.message}`));
    }

    createUrl(): void {
      this.$uibModal.open({
        component: 'projectUrlCreateModal',
        resolve: {
          environment: () => this.project.getDefaultEnvironment()
        }
      }).result.then(() => this.init());
    }

    editUrl(url: ProjectUrl): void {
      this.$uibModal.open({
        component: 'projectUrlEditModal',
        resolve: {
          environment: () => this.project.getDefaultEnvironment(),
          url: () => url.copy()
        }
      }).result.then(() => this.init());
    }

    deleteUrl(url: ProjectUrl): void {
      this.projectEnvironmentResource.deleteUrl(this.project.id, url.environment, url)
        .then(() => this.init())
        .catch(err => this.toastService.danger(`Could not delete URL. ${err.data.message}`));
    }

    get project(): Project {
      return this.projectService.store.currentProject;
    }
  }
};
