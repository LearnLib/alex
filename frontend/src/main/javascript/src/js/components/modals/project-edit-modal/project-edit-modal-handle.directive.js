/*
 * Copyright 2018 TU Dortmund
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

import {Project} from '../../../entities/project';

/**
 * The handle to open the modal to edit a project.
 *
 * @param $uibModal
 * @param {LearnerResource} LearnerResource
 * @param {ToastService} ToastService
 * @return {{restrict: string, scope: {project: string}, link(*=, *): void}}
 */
// @ngInject
export function projectEditModalHandleDirective($uibModal, LearnerResource, ToastService) {
    return {
        restrict: 'A',
        scope: {
            project: '='
        },
        link(scope, el) {
            el.on('click', () => {

                // check if the current project is used in learning and abort deletion
                // because of unknown side effects
                LearnerResource.getStatus(scope.project.id)
                    .then(status => {
                        if (status.active && status.project === scope.project.id) {
                            ToastService.info('You cannot edit this project because a learning process is still active.');
                        } else {
                            $uibModal.open({
                                component: 'projectEditModal',
                                resolve: {
                                    modalData: () => ({
                                        project: new Project(scope.project)
                                    })
                                }
                            });
                        }
                    });
            });
        }
    };
}
