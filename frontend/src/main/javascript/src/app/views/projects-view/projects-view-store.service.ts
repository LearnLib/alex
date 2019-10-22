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

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../../entities/project';
import { Selectable } from '../../utils/selectable';
import { ProjectApiService } from '../../services/resources/project-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateProjectModalComponent } from './create-project-modal/create-project-modal.component';
import { PromptService } from '../../services/prompt.service';
import { ToastService } from '../../services/toast.service';
import { ImportProjectModalComponent } from './import-project-modal/import-project-modal.component';
import { DownloadService } from '../../services/download.service';
import { removeItems, replaceItem } from '../../utils/list-utils';
import { EditProjectModalComponent } from './edit-project-modal/edit-project-modal.component';

@Injectable()
export class ProjectsViewStoreService {

  public readonly projectsSelectable: Selectable<Project>;
  private projects: BehaviorSubject<Project[]>;

  constructor(private projectApi: ProjectApiService,
              private modalService: NgbModal,
              private promptService: PromptService,
              private toastService: ToastService,
              private downloadService: DownloadService) {
    this.projects = new BehaviorSubject<Project[]>([]);
    this.projectsSelectable = new Selectable<Project>([], 'id');
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
          response => {
            this.toastService.danger(`The project could not be deleted. ${response.data.message}`);
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
            this.projectsSelectable.unselectMany(projects);
          },
          err => this.toastService.danger(`The projects could not be deleted. ${err.data.message}`)
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
    });
  }

  exportProject(project: Project): void {
    this.promptService.prompt('Enter a name for the json file.', project.name).then(name => {
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
    });
  }
}
