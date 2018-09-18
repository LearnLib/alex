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
 * The controller of the user settings page.
 */
class ProfileViewComponent {

    /**
     * Constructor.
     *
     * @param {UserResource} UserResource
     * @param {UserService} UserService
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(UserResource, UserService, ToastService) {

        /**
         * The user to edit.
         * @type {null|User}
         */
        this.user = null;

        // fetch the user from the api
        UserResource.get(UserService.store.currentUser.id)
            .then(user => this.user = user)
            .catch(err => ToastService.danger(`Loading the user failed. ${err.data.message}`));
    }
}

export const profileViewComponent = {
    controller: ProfileViewComponent,
    controllerAs: 'vm',
    template: require('./profile-view.component.html')
};
