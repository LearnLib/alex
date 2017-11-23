/*
 * Copyright 2016 TU Dortmund
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

import {Project} from "../../entities/Project";
import {events} from "../../constants";

/**
 * The controller of the modal window for editing a project.
 */
export class ProjectSettingsModalComponent {

    /**
     * Constructor.
     *
     * @param {ProjectResource} ProjectResource
     * @param {ToastService} ToastService
     * @param {EventBus} EventBus
     */
    // @ngInject
    constructor(ProjectResource, ToastService, EventBus) {
        this.ProjectResource = ProjectResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The form object.
         */
        this.form = null;

        /**
         * The project to edit.
         * @type {Project}
         */
        this.project = null;

        /**
         * The mirror URLs of the project.
         * @type {string[]}
         */
        this.mirrorUrls = null;

        /**
         * An error message that is displayed on a failed updated.
         * @type {null|string}
         */
        this.error = null;
    }

    $onInit() {
        this.project = this.resolve.modalData.project;
        this.mirrorUrls = this.project.mirrorUrls.join('\n');
    }

    /**
     * Updates the project. Closes the modal window on success.
     */
    updateProject() {
        this.error = null;

        this.project.mirrorUrls = [];
        this.mirrorUrls.split('\n').forEach(url => {
            const trimmedUrl = url.trim();
            if (trimmedUrl !== '') this.project.mirrorUrls.push(trimmedUrl);
        });

        this.ProjectResource.update(this.project)
            .then(updatedProject => {
                this.ToastService.success('Project updated');
                this.EventBus.emit(events.PROJECT_UPDATED, {project: updatedProject});
                this.dismiss();

                // set the form to its original state
                this.form.$setPristine();
                this.form.$setUntouched();
            })
            .catch(response => {
                this.error = response.data.message;
            });
    }
}


export const projectSettingsModalComponent = {
    templateUrl: 'html/components/modals/project-settings-modal.html',
    bindings: {
        dismiss: '&',
        resolve: '='
    },
    controller: ProjectSettingsModalComponent,
    controllerAs: 'vm',
};


// @ngInject
export function projectSettingsModalHandle($uibModal, LearnerResource, ToastService) {
    return {
        restrict: 'A',
        scope: {
            project: '='
        },
        link(scope, el) {
            el.on('click', () => {

                // check if the current project is used in learning and abort deletion
                // because of unknown side effects
                LearnerResource.isActive(scope.project.id)
                    .then(data => {
                        if (data.active && data.project === scope.project.id) {
                            ToastService.info('You cannot edit this project because a learning process is still active.');
                        } else {
                            $uibModal.open({
                                component: 'projectSettingsModal',
                                resolve: {
                                    modalData: function () {
                                        return {project: new Project(scope.project)};
                                    }
                                }
                            });
                        }
                    });
            });
        }
    };
}