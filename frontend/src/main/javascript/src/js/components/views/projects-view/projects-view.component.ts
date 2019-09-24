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

import {ProjectService} from '../../../services/project.service';
import {ToastService} from '../../../services/toast.service';
import {Project} from '../../../entities/project';
import {Selectable} from "../../../utils/selectable";
import {PromptService} from "../../../services/prompt.service";

/**
 * The controller that shows the page to manage projects.
 */
export const projectsViewComponent = {
  template: require('./projects-view.component.html'),
  controllerAs: 'vm',
  controller: class ProjectsViewComponent {

    public selectedProjects: Selectable<Project>;

    /**
     * Constructor.
     *
     * @param $state
     * @param projectService
     * @param toastService
     */
    /* @ngInject */
    constructor(private $state: any,
                private $uibModal: any,
                private projectService: ProjectService,
                private promptService: PromptService,
                private toastService: ToastService) {

      // go to the dashboard if there is a project in the session
      const project = this.projectService.store.currentProject;
      if (project !== null) {
        this.$state.go('project', {projectId: project.id});
        return;
      }

      this.selectedProjects = new Selectable<Project>([], 'id');

      //get all projects from the server
      this.projectService.load()
        .catch(err => {
          this.toastService.danger(`Loading project failed. ${err.data.message}`);
        });
    }

    createProject(): void {
      this.$uibModal.open({
        component: 'projectCreateModal',
      }).result.then((createdProject: Project) => {
        this.selectedProjects.addItem(createdProject);
      });
    }

    /**
     * Save a project into the sessionStorage and redirect to its dashboard.
     *
     * @param project The project to work on.
     */
    openProject(project: Project): void {
      this.projectService.open(project);
      this.$state.go('project', {projectId: project.id});
    }

    /**
     * Deletes a project.
     *
     * @param project The project to delete.
     */
    deleteProject(project: Project): void {
      this.promptService.confirm('Do you really want to delete this project? All related data will be lost.')
          .then(() => {
            this.projectService.delete(project)
                .then(() => {
                  this.toastService.success(`The project '${project.name}' has been deleted.`);
                })
                .catch(response => {
                  this.toastService.danger(`The project could not be deleted. ${response.data.message}`);
                });
          });
    }

    deleteSelectedProjects(): void {
      this.promptService.confirm('Do you really want to delete these projects? All related data will be lost.')
          .then(() => {
            const projects = this.selectedProjects.getSelected();
            this.projectService.deleteMany(projects)
                .then(() => {
                  this.toastService.success(`The projects have been deleted.`);
                  this.selectedProjects.unselectMany(projects);
                })
                .catch(err => this.toastService.danger(`The projects could not be deleted. ${err.data.message}`));
          });
    }

    /**
     * Edit the project.
     *
     * @param project The project to edit.
     */
    editProject(project: Project): void {
      this.projectService.update(project)
          .catch(err => this.toastService.danger(`The project could not be update. ${err.data.message}`));
    }

    editSelectedProject(): void {
      this.editProject(this.selectedProjects.getSelected()[0]);
    }

    get projects(): Project[] {
      return this.projectService.store.projects;
    }
  }
};
