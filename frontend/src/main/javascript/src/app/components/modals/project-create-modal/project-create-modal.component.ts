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

import { CreateProjectForm } from '../../../entities/project';
import { ModalComponent } from '../modal.component';
import { IFormController } from 'angular';
import { ProjectResource } from '../../../services/resources/project-resource.service';
import { ToastService } from '../../../services/toast.service';
import { ProjectService } from '../../../services/project.service';

export const projectCreateModalComponent = {
    template: require('html-loader!./project-create-modal.component.html'),
    bindings: {
        dismiss: '&',
        close: '&',
        resolve: '='
    },
    controllerAs: 'vm',
    controller: class ProjectCreateModalComponent extends ModalComponent {

        /** The form object. */
        public form: IFormController = null;

        /** The project to create. */
        public project: CreateProjectForm = {
            url: 'http://'
        };

        /** An error message that is displayed on a failed updated. */
        public errorMessage: string = null;

        /* @ngInject */
        constructor(private projectResource: ProjectResource,
                    private toastService: ToastService,
                    private projectService: ProjectService) {
            super();
        }

        createProject(): void {
            this.errorMessage = null;

            this.projectService.create(this.project)
                .then(createdProject => {
                    this.toastService.success('Project created');
                    this.close({$value: createdProject});
                })
                .catch(err => {
                    this.errorMessage = err.data.message;
                });
        }
    },
};
