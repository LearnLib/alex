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

/**
 * The controller of the user settings page.
 */
class UsersSettingsViewComponent {

    /**
     * Constructor.
     *
     * @param {UserResource} UserResource
     * @param {SessionService} SessionService
     * @param {ToastService} ToastService
     */
    // @ngInject
    constructor(UserResource, SessionService, ToastService) {

        // the user from the jwt
        const user = SessionService.getUser();

        /**
         * The user to edit.
         * @type {null|User}
         */
        this.user = null;

        // fetch the user from the api
        UserResource.get(user.id)
            .then(user => {
                this.user = user;
            })
            .catch(response => {
                ToastService.danger(`Loading the user failed. ${response.data.message}`);
            });
    }
}

export const usersSettingsViewComponent = {
    controller: UsersSettingsViewComponent,
    controllerAs: 'vm',
    template: require('./users-settings-view.component.html')
};
