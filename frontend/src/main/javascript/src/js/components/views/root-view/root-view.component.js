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

/**
 * The controller of the index page.
 */
class RootViewComponent {

    /**
     * Constructor.
     *
     * @param $state
     * @param {ProjectService} ProjectService
     * @param {UserService} UserService
     */
    // @ngInject
    constructor($state, ProjectService, UserService) {
        this.$state = $state;
        this.projectService = ProjectService;
        this.userService = UserService;

        if (this.user !== null) {
            if (this.project !== null) {
                $state.go('project', {projectId: this.project.id});
            } else {
                $state.go('projects');
            }
        }
    }

    handleLoggedIn() {
        this.$state.go('projects');
    }

    get user() {
        return this.userService.store.currentUser;
    }

    get project() {
        return this.projectService.store.currentProject;
    }
}

export const rootViewComponent = {
    controller: RootViewComponent,
    controllerAs: 'vm',
    template: require('./root-view.component.html')
};
