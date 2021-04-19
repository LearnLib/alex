/*
 * Copyright 2015 - 2021 TU Dortmund
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
import { Project } from '../../entities/project';
import { Selectable } from '../../utils/selectable';
import { ProjectApiService } from '../../services/api/project-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal.component';
import { PromptService } from '../../services/prompt.service';
import { ToastService } from '../../services/toast.service';
import { ImportProjectModalComponent } from './import-project-modal/import-project-modal.component';
import { DownloadService } from '../../services/download.service';
import { removeItems, replaceItem } from '../../utils/list-utils';
import { EditProjectModalComponent } from './edit-project-modal/edit-project-modal.component';
import { map } from 'rxjs/operators';
import { orderBy } from 'lodash';
import { AppStoreService } from '../../services/app-store.service';

@Injectable()
export class ProjectsViewStoreService {

  public readonly projectsSelectable: Selectable<Project, number>;
  private projects: BehaviorSubject<Project[]>;

  constructor(private appStore: AppStoreService,
              private projectApi: ProjectApiService,
              private modalService: NgbModal,
              private promptService: PromptService,
              private toastService: ToastService,
              private downloadService: DownloadService) {
    this.projects = new BehaviorSubject<Project[]>([]);
    this.projectsSelectable = new Selectable<Project, number>(p => p.id);
  }

  get projects$(): Observable<Project[]> {
    return this.projects.asObservable();
  }

  load(): void {
    this.projectApi.getAll().subscribe(
      projects => {
        this.projects.next(projects);
        this.projectsSelectable.addItems(projects);
      },
      console.error
    );
  }

  createProject(): void {
    const modalRef = this.modalService.open(CreateProjectModalComponent);
    modalRef.result.then(createdProject => {
      this.projects.next([...this.projects.value, createdProject]);
      this.projectsSelectable.addItem(createdProject);
    }).catch(() => {
    });
  }

  /**
   * Deletes a project.
   *
   * @param project The project to delete.
   */
  deleteProject(project: Project): void {
    this.promptService.confirm('Do you really want to delete this project? All related data will be lost.')
      .then(() => {
        this.projectApi.remove(project).subscribe(
          () => {
            this.projects.next(removeItems(this.projects.value, p => p.id === project.id));
            this.toastService.success(`The project '${project.name}' has been deleted.`);
          },
          res => {
            this.toastService.danger(`The project could not be deleted. ${res.error.message}`);
          }
        );
      });
  }

  deleteSelectedProjects(): void {
    this.promptService.confirm('Do you really want to delete these projects? All related data will be lost.')
      .then(() => {
        const projects = this.projectsSelectable.getSelected();
        this.projectApi.removeMany(projects).subscribe(
          () => {
            this.toastService.success(`The projects have been deleted.`);
            const ids = projects.map(p => p.id);
            this.projects.next(removeItems(this.projects.value, (p => ids.indexOf(p.id) > -1)));
            this.projectsSelectable.removeMany(projects);
          },
          res => this.toastService.danger(`The projects could not be deleted. ${res.error.message}`)
        );
      });
  }

  /**
   * Edit the project.
   *
   * @param project The project to edit.
   */
  editProject(project: Project): void {
    const modalRef = this.modalService.open(EditProjectModalComponent);
    modalRef.componentInstance.project = project.copy();
    modalRef.result.then(updatedProject => {
      this.projects.next(replaceItem(this.projects.value, p => p.id === updatedProject.id, updatedProject));
      this.projectsSelectable.update(updatedProject);
    }).catch(() => {
    });
  }

  exportProject(project: Project): void {
    this.promptService.prompt('Enter a name for the json file.', {defaultValue: project.name}).then(name => {
      this.projectApi.export(project.id).subscribe(data => {
        this.downloadService.downloadObject(data, name);
      });
    });
  }

  importProject(): void {
    const modalRef = this.modalService.open(ImportProjectModalComponent);
    modalRef.result.then(importedProject => {
      this.projects.next([...this.projects.value, importedProject]);
      this.projectsSelectable.addItem(importedProject);
    }).catch(() => {
    });
  }

  get orderedProjects$(): Observable<Project[]> {
    return this.projects$.pipe(
      map(projects => {
        const asOwner = projects.filter(p => p.owners.includes(this.appStore.user.id));
        orderBy(asOwner, ['name']);
        const asMember = projects.filter(p => p.members.includes(this.appStore.user.id));
        orderBy(asMember, ['name']);
        return asOwner.concat(asMember);
      })
    );
  }

  leaveProject(project: Project): void {
    if (project.members.includes(this.appStore.user.id)) {
      this.projectApi.removeMembers(project.id, Array.of(this.appStore.user.id)).subscribe(
        () => {
          this.toastService.success('You have left the project.');
          this.projects.next(this.projects.value.filter(projectInt => projectInt.id !== project.id));
          this.projectsSelectable.remove(project);
        },
        res => this.toastService.danger(`${res.error.message}`));
    }
    if (project.owners.includes(this.appStore.user.id)) {
      this.projectApi.removeOwners(project.id, Array.of(this.appStore.user.id)).subscribe(
        () => {
          this.toastService.success('You have left the project.');
          this.projects.next(this.projects.value.filter(projectInt => projectInt.id !== project.id));
          this.projectsSelectable.remove(project);
        },
        res => this.toastService.danger(`${res.error.message}`));
    }
  }
}
