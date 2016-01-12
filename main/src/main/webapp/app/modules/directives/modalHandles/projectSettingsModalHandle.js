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

import {Project} from '../../entities/Project';

// @ngInject
function projectSettingsModalHandle($modal, LearnerResource, ToastService) {
    return {
        restrict: 'A',
        scope: {
            project: '='
        },
        link: link
    };

    function link(scope, el) {
        el.on('click', () => {

            // check if the current project is used in learning and abort deletion
            // because of unknown side effects
            LearnerResource.isActive()
                .then(data => {
                    if (data.active && data.project === scope.project.id) {
                        ToastService.info('You cannot edit this project because a learning process is still active.');
                    } else {
                        $modal.open({
                            templateUrl: 'views/modals/project-settings-modal.html',
                            controller: 'ProjectSettingsModalController',
                            controllerAs: 'vm',
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
}

export default projectSettingsModalHandle;