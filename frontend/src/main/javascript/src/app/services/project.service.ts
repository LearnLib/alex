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

import { remove } from 'lodash';
import { CreateProjectForm, Project } from '../entities/project';
import { LearnerResource } from './resources/learner-resource.service';
import { ToastService } from './toast.service';
import { ProjectApiService } from './resources/project-api.service';
import { IPromise } from 'angular';
import { AppStoreService } from './app-store.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface ProjectStore {
  projects: Project[];
}

export class ProjectService {

  /** The store. */
  public store: ProjectStore;

  /* @ngInject */
  constructor(private $uibModal: any,
              private learnerResource: LearnerResource,
              private toastService: ToastService,
              private projectApi: ProjectApiService,
              private appStore: AppStoreService) {

    this.store = {
      projects: []
    };
  }

  load(): Observable<Project[]> {
    return this.projectApi.getAll().pipe(
      tap((projects: Project[]) => this.store.projects = projects)
    );
  }

  reloadCurrentProject(): void {
    if (this.appStore.project != null) {
      this.projectApi.get(this.appStore.project.id).subscribe(
        p => this.appStore.openProject(p)
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
  create(project: CreateProjectForm): Observable<Project> {
    return this.projectApi.create(project).pipe(
      tap((p: Project) => this.store.projects.push(p))
    );
  }

  /**
   * Deletes a project.
   *
   * @param project The project to delete.
   */
  delete(project: Project): Observable<Project> {
    return this.projectApi.remove(project).pipe(
      tap((p: Project) => remove(this.store.projects, {id: p.id}))
    );
  }

  deleteMany(projects: Project[]): Observable<Project[]> {
    return this.projectApi.removeMany(projects).pipe(
      tap((ps: Project[]) => {
        ps.forEach(p => remove(this.store.projects, {id: p.id}))
      })
    );
  }

  import(project: Project): Observable<Project> {
    return this.projectApi.import(project).pipe(
      tap((p: Project) => this.store.projects.push(p))
    );
  }
}
