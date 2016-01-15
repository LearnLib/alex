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

import {events} from '../../constants';
import {Project} from '../../entities/Project';

/**
 * The controller of the modal window for editing a project
 */
// @ngInject
class ProjectSettingsModalController {

    /**
     * Constructor
     * @param $modalInstance
     * @param modalData
     * @param ProjectResource
     * @param ToastService
     * @param EventBus
     */
    constructor($modalInstance, modalData, ProjectResource, ToastService, EventBus) {
        this.$modalInstance = $modalInstance;
        this.ProjectResource = ProjectResource;
        this.ToastService = ToastService;
        this.EventBus = EventBus;

        /**
         * The project to edit
         * @type {Project}
         */
        this.project = modalData.project;

        /**
         * An error message that is displayed on a failed updated
         * @type {null|string}
         */
        this.error = null;
    }

    /** Updates the project. Closes the modal window on success. */
    updateProject () {
        this.error = null;

        this.ProjectResource.update(this.project)
            .then(updatedProject => {
                this.ToastService.success('Project updated');
                this.EventBus.emit(events.PROJECT_UPDATED, {project: updatedProject});
                this.$modalInstance.dismiss();

                // set the form to its original state
                this.form.$setPristine();
                this.form.$setUntouched();
            })
            .catch(response => {
                this.error = response.data.message;
            });
    }

    /** Closes the modal window */
    close () {
        this.$modalInstance.dismiss();
    }
}

export default ProjectSettingsModalController;