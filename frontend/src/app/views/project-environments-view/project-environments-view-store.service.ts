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
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectEnvironment } from '../../entities/project-environment';
import { ProjectEnvironmentApiService } from '../../services/api/project-environment-api.service';
import { AppStoreService } from '../../services/app-store.service';
import { Project } from '../../entities/project';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectUrl } from '../../entities/project-url';
import { ProjectEnvironmentVariable } from '../../entities/project-environment-variable';
import { ToastService } from '../../services/toast.service';
import { PromptService } from '../../services/prompt.service';
import { CreateProjectUrlModalComponent } from './create-project-url-modal/create-project-url-modal.component';
import { EditProjectUrlModalComponent } from './edit-project-url-modal/edit-project-url-modal.component';
import { CreateEnvironmentVariableModalComponent } from './create-environment-variable-modal/create-environment-variable-modal.component';
import { EditEnvironmentVariableModalComponent } from './edit-environment-variable-modal/edit-environment-variable-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ProjectEnvironmentsViewStoreService {

  private environments: BehaviorSubject<ProjectEnvironment[]>;

  constructor(private appStore: AppStoreService,
              private environmentApi: ProjectEnvironmentApiService,
              private modalService: NgbModal,
              private toastService: ToastService,
              private promptService: PromptService) {
    this.environments = new BehaviorSubject<ProjectEnvironment[]>([]);
  }

  public get environments$(): Observable<ProjectEnvironment[]> {
    return this.environments.asObservable();
  }

  private get project(): Project {
    return this.appStore.project;
  }

  load(): void {
    this.environmentApi.getAll(this.project.id).subscribe(
      environments => {
        this.environments.next(environments);
      }
    );
  }

  createEnvironment(): void {
    this.promptService.prompt('Enter a name for the environment').then(
      name => {
        const env = new ProjectEnvironment();
        env.name = name;
        this.environmentApi.create(this.project.id, env).subscribe(
          () => this.init()
        );
      }
    );
  }

  editEnvironment(env: ProjectEnvironment): void {
    this.promptService.prompt('Change the name of the environment', {defaultValue: env.name}).then(
      name => {
        const copy = env.copy();
        copy.name = name;
        this.environmentApi.update(this.project.id, copy).subscribe(
          () => {
            this.toastService.success(`The environment has been updated.`);
            this.init();
          },
          res => this.toastService.danger(`Could not update environment. ${res.error.message}`)
        );
      }
    );
  }

  deleteEnvironment(env: ProjectEnvironment): void {
    if (this.environments.value.length === 1) {
      this.toastService.danger('You cannot delete the only environment in a project.');
    } else {
      this.promptService.confirm('When deleting the environment, associated test reports and learner results are deleted as well. Are you sure?').then(() => {
        this.environmentApi.delete(this.project.id, env).subscribe(
          () => {
            this.toastService.success(`Environment ${env.name} has been deleted.`);
            this.init();
          },
          res => this.toastService.danger(`Could not update environment. ${res.error.message}`)
        );
      });
    }
  }

  makeEnvironmentDefault(env: ProjectEnvironment): void {
    if (env.default) {return;}

    const e = env.copy();
    e.default = true;
    this.environmentApi.update(env.project, e).subscribe(
      () => this.init(),
      res => this.toastService.danger(`Failed to make environment default. ${res.error.message}`)
    );
  }

  makeUrlDefault(env: ProjectEnvironment, url: ProjectUrl): void {
    if (url.default) {return;}

    const u = url.copy();
    u.default = true;
    this.environmentApi.updateUrl(env.project, env.id, url.id, u).subscribe(
      () => this.init(),
      res => this.toastService.danger(`Failed to make URL default. ${res.error.message}`)
    );
  }

  createUrl(): void {
    const modalRef = this.modalService.open(CreateProjectUrlModalComponent);
    modalRef.componentInstance.environment = this.project.getDefaultEnvironment();
    modalRef.result
      .then(() => this.init())
      .catch(() => {
      });
  }

  editUrl(env: ProjectEnvironment, url: ProjectUrl): void {
    const modalRef = this.modalService.open(EditProjectUrlModalComponent);
    modalRef.componentInstance.environment = env;
    modalRef.componentInstance.url = url.copy();
    modalRef.result
      .then(() => this.init())
      .catch(() => {
      });
  }

  deleteUrl(env: ProjectEnvironment, url: ProjectUrl): void {
    this.environmentApi.deleteUrl(this.project.id, env.id, url).subscribe(
      () => this.init(),
      res => this.toastService.danger(`Could not delete URL. ${res.error.message}`)
    );
  }

  createVariable(): void {
    const modalRef = this.modalService.open(CreateEnvironmentVariableModalComponent);
    modalRef.componentInstance.environment = this.project.getDefaultEnvironment();
    modalRef.result
      .then(() => this.init())
      .catch(() => {
      });
  }

  editVariable(env: ProjectEnvironment, variable: ProjectEnvironmentVariable): void {
    const modalRef = this.modalService.open(EditEnvironmentVariableModalComponent);
    modalRef.componentInstance.environment = env;
    modalRef.componentInstance.variable = variable.copy();
    modalRef.result
      .then(() => this.init())
      .catch(() => {
      });
  }

  deleteVariable(env: ProjectEnvironment, variable: ProjectEnvironmentVariable): void {
    this.environmentApi.deleteVariable(this.project.id, env.id, variable).subscribe(
      () => this.init(),
      res => this.toastService.danger(`Could not delete variable. ${res.error.message}`)
    );
  }

  private init(): void {
    this.load();
    this.appStore.reloadProject();
  }
}
