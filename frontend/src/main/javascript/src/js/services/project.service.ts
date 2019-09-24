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

import * as remove from 'lodash/remove';
import { CreateProjectForm, Project } from '../entities/project';
import {LearnerResource} from './resources/learner-resource.service';
import {ToastService} from './toast.service';
import {ProjectResource} from './resources/project-resource.service';
import {IPromise} from 'angular';

export interface ProjectStore {
  currentProject?: Project;
  projects: Project[];
}

export class ProjectService {

  /** The store. */
  public store: ProjectStore;

  /**
   * Constructor.
   *
   * @param $uibModal
   * @param learnerResource
   * @param toastService
   * @param projectResource
   */
  /* @ngInject */
  constructor(private $uibModal: any,
              private learnerResource: LearnerResource,
              private toastService: ToastService,
              private projectResource: ProjectResource) {

    this.store = {
      currentProject: null,
      projects: []
    };

    // load the project from the session
    const projectInSession = sessionStorage.getItem('project');
    if (projectInSession != null) {
      this.store.currentProject = new Project(JSON.parse(projectInSession));
    }
  }

  load(): IPromise<any> {
    return this.projectResource.getAll()
      .then(projects => {
        this.store.projects = projects;
        return projects;
      });
  }

  reloadCurrentProject(): void {
    if (this.store.currentProject != null) {
      this.projectResource.get(this.store.currentProject.id).then(
          p => this.open(p)
      );
    }
  }

  /**
   * Updates a project.
   *
   * @param project The project to update.
   * @return The promise with the updated project on success.
   */
  update(project: Project): IPromise<any> {
    return this.learnerResource.getStatus(project.id)
      .then(status => {
        if (status.active && status.project === project.id) {
          this.toastService.info('You cannot edit this project because a learning process is still active.');
        } else {
          return this.$uibModal.open({
            component: 'projectEditModal',
            resolve: {
              project: () => new Project(JSON.parse(JSON.stringify(project)))
            }
          }).result.then((updatedProject: Project) => {
            const i = this.store.projects.findIndex(p => p.id === updatedProject.id);
            if (i > -1) this.store.projects[i] = updatedProject;
            return updatedProject;
          });
        }
      });
  }

  /**
   * Creates a new project.
   *
   * @param project The project to create.
   */
  create(project: CreateProjectForm): IPromise<any> {
    return this.projectResource.create(project)
      .then(createdProject => {
        this.store.projects.push(createdProject);
        return createdProject;
      });
  }

  /**
   * Deletes a project.
   *
   * @param project The project to delete.
   */
  delete(project: Project): IPromise<any> {
    return this.projectResource.remove(project)
      .then(() => {
        remove(this.store.projects, {id: project.id});
        return project;
      });
  }

  deleteMany(projects: Project[]): IPromise<any> {
    return this.projectResource.removeMany(projects)
        .then(() => {
          projects.forEach(p => remove(this.store.projects, {id: p.id}));
          return projects;
        });
  }

  /**
   * Saves a project in the current session.
   *
   * @param project The project to.
   */
  open(project: Project): void {
    sessionStorage.setItem('project', JSON.stringify(project));
    this.store.currentProject = project;
  }

  /**
   * Removes the current project from the session.
   */
  close(): void {
    sessionStorage.removeItem('project');
    this.store.currentProject = null;
  }

  reset(): void {
    this.close();
    this.store.projects = [];
  }
}
